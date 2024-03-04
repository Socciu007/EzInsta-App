import React, { useEffect, useState } from 'react';
import closePopup from '../../../assets/pictures/icon-x.svg';
import PopupComponent from '../PopupComponent/PopupComponent';
import './style.scss';
import { storageProfiles } from '../../../common/const.config';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { MenuItem, Select } from '@mui/material';
import { dbSetLocally, updateProfile } from '../../../sender';
import Dialog from '@mui/material/Dialog';
import { Store } from 'react-notifications-component';
import notification from '../../../resources/notification.json';
const PopupAddProxy = ({
  profilesSelected,
  openAddProxy,
  handleCloseAdd,
  handleOpenProxyManage,
  dataProfiles,
  getProfiles,
}) => {
  const [proxyType, setProxyType] = useState('http');
  const [proxyString, setProxyString] = useState('');
  const handleWriteText = () => {
    document.getElementById('proxyString').focus();
  };

  const onChangeProxyType = (e) => {
    setProxyType(e.target.value);
  };

  const onchangeProxyString = (value) => {
    setProxyString(value);
  };

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${proxyString ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');
  const changeProxy = async () => {
    if (proxyString !== '') {
      const listProxy = [];
      const listProxyString = proxyString.split('\n');
      listProxyString.forEach((proxy) => {
        if (proxy.includes(':')) {
          const host = proxy.split(':')[0];
          const port = proxy.split(':')[1];
          const username = proxy.split(':')[2] ? proxy.split(':')[2] : '';
          const password = proxy.split(':')[3] ? proxy.split(':')[3] : '';
          listProxy.push({
            host,
            port,
            username,
            password,
            mode: proxyType,
          });
        }
      });
      if (listProxy.length < profilesSelected.length) {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: `Enter all ${profilesSelected.length} proxies!`,
        });
      } else {
        for (let i = 0; i < profilesSelected.length; i++) {
          const res = await updateProfile(profilesSelected[i].id, listProxy[i]);

          if (res && res.code == 1) {
            const index = dataProfiles.findIndex((e) => e.id === profilesSelected[i].id);
            const newData = [...dataProfiles];
            newData[index].proxy = res.result.proxy;
            await dbSetLocally(storageProfiles, newData);
          }
        }
        getProfiles();
        handleCloseAdd();
        setTimeout(() => {
          Store.addNotification({
            ...notification,
            type: 'success',
            message: 'Add proxy to profiles success!',
          });
        }, 500);
      }
    } else {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Please type proxies!',
      });
    }
  };
  const makeCopy = {
    background: '#fff',
    position: 'fixed',
    maxWidth: '100% !important',
    width: '1163px',
    height: '679px',
    top: '50%',
    left: '50%',
    transform: ' translate(-50%, -50%)',
    borderRadius: '15px',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    flexShrink: '0',
    zIndex: '99999',
    margin: '0',
    overflow: 'inherit !important',
  };

  const overlay = {
    background: 'rgba(255,255,255,0.9)',
  };
  const MuiDialogPaper = {
    width: '1163px',
    height: '679px',
    maxHeight: '679px !important',
    minWidth: '1163px !important',
    color: '#01162b !important',
  };
  const MuiDialogContainerProxy = {
    display: 'block',
  };
  return (
    <Dialog
      open={openAddProxy}
      onClose={handleCloseAdd}
      sx={{
        '& .MuiPaper-root': makeCopy,
        '& .MuiBackdrop-root': overlay,
        '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': MuiDialogPaper,
        '& .MuiDialog-container': MuiDialogContainerProxy,
      }}
    >
      <div className="modal">
        <div className="-add-proxys">
          <div className="-close-popup" onClick={handleCloseAdd}>
            <img src={closePopup} alt="icon-x"></img>
          </div>
          <h1>ADD PROXY</h1>
          <p>
            Add new proxies to{' '}
            <b>
              {profilesSelected.length} {profilesSelected.length === 1 ? 'profile' : 'profiles'}
            </b>
          </p>
          <div className="-add-proxys__type">
            <p>Connection type</p>
            <div className="-add-proxys-nav">
              <Select
                name="proxyType"
                className="-add-proxys-nav__select -add-proxys-nav__details"
                onChange={onChangeProxyType}
                value={proxyType}
              >
                <MenuItem value="http">HTTP</MenuItem>
                <MenuItem value="socks4">Socks 4</MenuItem>
                <MenuItem value="socks5">Socks 5</MenuItem>
                <MenuItem value="ssh">SSH</MenuItem>
              </Select>
            </div>
          </div>
          <div className="-add-proxys__type">
            <p>Proxy list</p>
            <div className="-add-proxys-nav -list-proxys">
              <div className="keywordText">
                <Editor
                  value={proxyString}
                  onValueChange={onchangeProxyString}
                  highlight={(proxyString) => hightlightWithLineNumbers(proxyString, languages.js)}
                  padding={15}
                  onClick={handleWriteText}
                  className="editor"
                  textareaId="proxyString"
                />
              </div>

              <div
                className="placeholder"
                onClick={handleWriteText}
                style={{ display: proxyString ? 'none' : 'inline' }}
              >
                <p>
                  <span>1</span>
                  <div>Enter the content here</div>
                </p>
                <p>
                  <span>2</span>
                  <div>
                    <span style={{ opacity: 1, fontWeight: 700 }}>Proxy format: </span>IP:Port:Username:Password
                  </div>
                </p>
                <p>
                  <span>3</span>
                  <div>1 proxy/line</div>
                </p>
                <p>
                  <span>4</span>
                  <div>The number of proxies should not be less or more than the number of profiles</div>
                </p>
              </div>
              <div onClick={changeProxy} className="-list-proxys__save">
                Save
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PopupAddProxy;
