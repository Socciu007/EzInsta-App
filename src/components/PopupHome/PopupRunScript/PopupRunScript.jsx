import React, { useEffect, useState } from 'react';
import './style.scss';
import { Table, Tooltip } from 'antd';
import PopupComponent from '../PopupComponent/PopupComponent';
import closePopup from '../../../assets/pictures/icon-x.svg';
import search from '../../../assets/pictures/icon-search.svg';
import yourScript from '../../../assets/pictures/icon-yourScripts1.svg';
// import yourScript from '../../../assets/pictures/icon-yourScripts.svg';

import { useSelector } from 'react-redux';
const PopupRunScript = ({ openRunScript, handleCloseRunScript, script }) => {
  const profiles = useSelector((state) => state.profile);
  const scriptName = useSelector((state) => state.scriptAuto);
  const [dataProfiles, setDataProfiles] = useState(profiles);
  const [dataSearch, setDataSearch] = useState(profiles);
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    const newData = profiles.filter((e) => e.script == script);
    setDataSearch(newData);
    setDataProfiles(newData);
  }, [profiles]);

  const generateProxyStr = (proxy, shot = true) => {
    let proxyStr =
      proxy.host && proxy.host.length
        ? `${proxy.host}:${proxy.port}${proxy.username && proxy.username != '' ? ':' + proxy.username : ''}${
            proxy.password ? ':' + proxy.password : ''
          }`
        : 'none';

    if (proxyStr.length > 30 && shot) {
      proxyStr = `${proxy.host}:${proxy.port}...`;
    }
    return proxyStr;
  };

  useEffect(() => {
    if (dataProfiles && dataSearch) {
      let newData = [];
      dataSearch.forEach((e) => {
        const profile = dataProfiles.find((o) => o.id == e.id);
        if (profile) {
          const check = newData.find((o) => o.id == profile.id);
          if (!check) {
            newData.push(profile);
          }
        }
      });
      setDataSearch(
        newData.map((e, index) => {
          return { ...e, key: index + 1 };
        }),
      );
    }
  }, [dataProfiles]);
  const generateNoteStr = (note, shot = true, length = 75) => {
    let noteStr = note && note.length ? `${note}` : '';

    if (noteStr.length > length && shot) {
      noteStr = `${note.slice(0, length)}...`;
    }
    return noteStr;
  };
  const searchProfiles = (text) => {
    setTextSearch(text);
    if (text == '') {
      setDataSearch(dataSearch);
    } else {
      const newData = profiles.filter((e) => {
        const textLowerCase = text.toLowerCase();
        const mode = e.mode ? e.mode.toLowerCase() : '';
        const host = e.host ? e.host.toLowerCase() : '';
        const port = e.port ? e.port.toString().toLowerCase() : '';
        const username = e.username ? e.username.toLowerCase() : '';
        const password = e.password ? e.password.toLowerCase() : '';
        return (
          mode.includes(textLowerCase) ||
          host.includes(textLowerCase) ||
          port.includes(textLowerCase) ||
          username.includes(textLowerCase) ||
          password.includes(textLowerCase)
        );
      });
      setDataSearch(newData);
    }
  };

  const columnsProxys = [
    {
      title: 'UID',
      width: 200,
      render: (profile) => {
        return (
          <div className="-text-profile">
            <span>{profile.uid}</span>
            {/* {profile.isPin && <img src={pin} alt="icon-pin"></img>} */}
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'nameAccount',
      width: 150,
      render: (nameAccount) => (
        <Tooltip placement="topLeft" title={nameAccount}>
          {nameAccount}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: 'descend',
      // defaultSortOrder: 'descend',
      render: (status) => {
        if (status === 'ready') {
          return (
            <div className="-status-profiles -status-profiles-ready">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          );
        } else if (status.toLowerCase().includes('error')) {
          return (
            <div className="-status-profiles -status-profiles-used">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          );
        } else {
          return <div className="-status-profiles">{status.charAt(0).toUpperCase() + status.slice(1)}</div>;
        }
      },
    },
    {
      title: 'Proxy',
      dataIndex: 'proxy',
      width: 220,
      ellipsis: {
        showTitle: false,
      },
      render: (proxy) => {
        return (
          <div className="-proxy-profiles">
            <Tooltip placement="topLeft" title={generateProxyStr(proxy, false)}>
              {generateProxyStr(proxy)}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      width: 200,
      sorter: (a, b) => {
        if (!a.isPin && !b.isPin) {
          const tagsA = a.tag ? a.tag.join(',').toLowerCase() : '';
          const tagsB = b.tag ? b.tag.join(',').toLowerCase() : '';
          if (tagsA < tagsB) {
            return -1;
          }
          if (tagsA > tagsB) {
            return 1;
          }
          return 0;
        }
      },
      render: (tag) => (
        <Tooltip placement="topLeft" title={generateNoteStr(tag, false)}>
          <p className="-tag-profiles">{generateNoteStr(tag, true, 2)}</p>
        </Tooltip>
      ),
    },
  ];
  return (
    <PopupComponent open={openRunScript} onClose={handleCloseRunScript}>
      {
        <div className="layout-run-script">
          <div className="layout-run-script__container -proxy-manage">
            <div className="-nav-scripts">
              <div className="-nav-scripts__header">
                <div className="-nav-scripts__header__close" onClick={handleCloseRunScript}>
                  <img src={closePopup} alt="icon-x"></img>
                </div>
                <h1>RUNNING PROFILES</h1>
              </div>
              <div className="-search-profiles">
                <span>
                  <img src={search} alt="icon-search" style={{ marginLeft: '11px' }}></img>
                </span>
                <input
                  value={textSearch}
                  onChange={(event) => {
                    searchProfiles(event.target.value);
                  }}
                  placeholder="Search..."
                ></input>
              </div>
            </div>
            <div className="layout-run-script__container__name">
              <div className="layout-run-script__container__name__title">
                <img src={yourScript} alt="img-yourScript" />
                <div>
                  <p style={{ display: 'inline', fontWeight: '600' }}>Script:</p> {scriptName}
                </div>
              </div>
            </div>
            <div className="-container-scripts -proxy-manage__content">
              <Table
                rowClassName={(profile) => (profile.isPin ? 'editable-row' : 'editable-row')}
                columns={columnsProxys}
                dataSource={dataSearch}
                pagination={false}
              ></Table>
            </div>
          </div>
        </div>
      }
    </PopupComponent>
  );
};

export default PopupRunScript;
