import { Switch } from 'antd';
import './style.scss';
import React, { useEffect, useState } from 'react';
import edit from '../../../assets/pictures/icon-edit.png';
import deleted from '../../../assets/pictures/icon-delete.svg';
import question from '../../../assets/pictures/icon-question.svg';
import x from '../../../assets/pictures/icon-x.svg';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { MenuItem, Select } from '@mui/material';

const SettingProxy = ({
  data,
  keyList,
  editProxy,
  handleOpenEdit,
  handleCloseEdit,
  handleAddProxy,
  onChangeAssignProxy,
  settings,
  handleDeleteProxy,
}) => {
  const [proxyType, setProxyType] = useState('http');
  const [proxyString, setProxyString] = useState('');
  const [listProxy, setListProxy] = useState([]);

  useEffect(() => {
    setListProxy(data);
  }, [data]);
  const onChangeProxyType = (event) => {
    setProxyType(event.target.value);
  };

  const handleOpenWriteText = () => {
    document.getElementById('proxyString').focus();
  };

  const generateProxyStr = (proxy) => {
    let proxyStr = `${proxy.host}:${proxy.port}${proxy.username && proxy.username != '' ? ':' + proxy.username : ''}${
      proxy.password ? ':' + proxy.password : ''
    }`;

    return proxyStr;
  };
  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${proxyString ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');
  return (
    <div className="-settings-proxys">
      <div className="-container-proxys">
        <h2>PROXY SETTINGS</h2>
        <div className="-details-proxys">
          <div className="-list-proxys">
            <p>
              Proxy list {} ({listProxy?.length})
            </p>
            <div className="-info-list">
              <div className="-scroll-list">
                <ul>
                  {listProxy.length !== 0 &&
                    listProxy.map((proxy, index) => (
                      <li key={proxy.id}>
                        <div className="-key-proxys">
                          <p>{index + 1}</p>
                        </div>
                        {proxy.id === keyList && editProxy ? (
                          <div className="-action-proxys -action-proxys-active">
                            <span>{generateProxyStr(proxy)}</span>
                            <div className="-action-icon-proxys">
                              <div
                                className="-action-icon"
                                onClick={() => {
                                  handleCloseEdit();
                                  setProxyString('');
                                }}
                              >
                                <img src={x} alt="icon-x"></img>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="-action-proxys">
                            <span>{generateProxyStr(proxy)}</span>
                            <div className="-action-icon-proxys">
                              <div
                                className="-action-icon"
                                onClick={() => {
                                  handleOpenEdit(proxy.id);
                                  setProxyString(generateProxyStr(proxy));
                                  setProxyType(proxy.mode);
                                }}
                              >
                                <img src={edit} alt="icon-edit"></img>
                              </div>
                              <div onClick={() => handleDeleteProxy(proxy.id)} className="-action-icon">
                                <img src={deleted} alt="icon-remove"></img>
                              </div>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="-add-Listproxys" style={{ marginLeft: '1.5rem' }}>
            <p>{keyList ? 'Edit proxy' : 'Add proxy'}</p>
            <div className="-add-proxys">
              <div className="-type-proxys">
                <div className="-type-proxys__nav">
                  {/* <Select
                    name="url"
                    className="-type-proxys__nav__details"
                    onChange={(value) => {
                      onChangeProxyType(value);
                    }}
                    bordered={false}
                    defaultValue={proxyType}
                    value={proxyType}
                    options={[
                      {
                        value: 'http',
                        label: 'HTTP',
                      },
                      {
                        value: 'socks4',
                        label: 'Socks 4',
                      },
                      {
                        value: 'socks5',
                        label: 'Socks 5',
                      },
                      {
                        value: 'ssh',
                        label: 'SSH',
                      },
                    ]}
                  /> */}
                  <Select
                    name="url"
                    className="-type-proxys__nav__details"
                    onChange={onChangeProxyType}
                    value={proxyType}
                  >
                    <MenuItem value="http">HTTP</MenuItem>
                    <MenuItem value="socks4">Socks 4</MenuItem>
                    <MenuItem value="socks5">Socks 5</MenuItem>
                    <MenuItem value="ssh">SSH</MenuItem>
                  </Select>
                </div>
                {/* <div className="-icon-proxys" onClick={handleOpenProxyManage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 2C0 0.895431 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V4.75C15 5.85457 14.1046 6.75 13 6.75H2C0.89543 6.75 0 5.85457 0 4.75V2ZM4.5 3.375C4.5 3.99632 3.99632 4.5 3.375 4.5C2.75368 4.5 2.25 3.99632 2.25 3.375C2.25 2.75368 2.75368 2.25 3.375 2.25C3.99632 2.25 4.5 2.75368 4.5 3.375ZM6.375 4.5C6.99632 4.5 7.5 3.99632 7.5 3.375C7.5 2.75368 6.99632 2.25 6.375 2.25C5.75368 2.25 5.25 2.75368 5.25 3.375C5.25 3.99632 5.75368 4.5 6.375 4.5Z"
                      fill="#01162B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 10.25C0 9.14543 0.895431 8.25 2 8.25H13C14.1046 8.25 15 9.14543 15 10.25V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V10.25ZM4.5 11.625C4.5 12.2463 3.99632 12.75 3.375 12.75C2.75368 12.75 2.25 12.2463 2.25 11.625C2.25 11.0037 2.75368 10.5 3.375 10.5C3.99632 10.5 4.5 11.0037 4.5 11.625ZM6.375 12.75C6.99632 12.75 7.5 12.2463 7.5 11.625C7.5 11.0037 6.99632 10.5 6.375 10.5C5.75368 10.5 5.25 11.0037 5.25 11.625C5.25 12.2463 5.75368 12.75 6.375 12.75Z"
                      fill="#01162B"
                    />
                  </svg>
                </div> */}
                {/* <PopupProxyManage
                  defaultProxies={settings.proxies}
                  handleAddProxyFromManager={handleAddProxyFromManager}
                  openProxyManage={openProxyManage}
                  handleCloseProxyManage={handleCloseProxyManage}
                ></PopupProxyManage> */}
              </div>
              <div className="-info-add-proxys">
                <div style={{ position: 'relative' }} className="proxy-item">
                  <div className="proxy-editor" style={{ width: '100%', height: 379, overflow: 'auto' }}>
                    <Editor
                      value={proxyString}
                      onValueChange={(proxyString) => setProxyString(proxyString)}
                      highlight={(proxyString) => hightlightWithLineNumbers(proxyString, languages.js)}
                      padding={15}
                      className="editor"
                      textareaId="proxyString"
                      style={{
                        background: '#fff',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div
                    onClick={handleOpenWriteText}
                    style={{ display: proxyString ? 'none' : 'inline' }}
                    className="-list-info"
                  >
                    <p>
                      <span>1</span>
                      Enter the proxy here
                    </p>
                    <p>
                      <span>2</span>
                      <b>Proxy format:</b> Host:Port:Username:Password
                    </p>
                  </div>
                </div>

                <button
                  className="-add"
                  onClick={() => {
                    handleAddProxy(proxyString, proxyType);
                    setProxyType('http');
                    setProxyString('');
                  }}
                >
                  {keyList ? 'CHANGE' : 'ADD'}
                </button>
                <div className="-setting-proxys">
                  <Switch checked={settings.assignProxy} onChange={onChangeAssignProxy} width={32} height={20} />
                  <p>Assign proxy here to all selected profiles </p>
                  <div className="-hover-question">
                    <img src={question} alt="question"></img>
                    <div className="-hover-question__hide">
                      <p>Assign proxy here to all selected profiles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingProxy;
