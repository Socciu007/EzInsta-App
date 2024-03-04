import React, { useEffect, useState } from 'react';
import PopupComponent from '../PopupComponent/PopupComponent';
import closePopup from '../../../assets/pictures/icon-x.svg';
import search from '../../../assets/pictures/icon-search.svg';
import refresh from '../../../assets/pictures/icon-refresh.png';
import { Table } from 'antd';
import { formatTimeDay } from '../../../services/utils';
import { aesDecrypt } from '../../../services/crypto-js';
import { storageProfiles } from '../../../common/const.config';
import { dbSetLocally } from '../../../sender';
import { Store } from 'react-notifications-component';
import notification from '../../../resources/notification.json';
const PopupProxyManage = ({
  openProxyManage,
  handleCloseProxyManage,
  defaultProxies,
  handleAddProxyFromManager,
  startScreen,
  profilesSelected,
  getProfiles,
  dataProfiles,
}) => {
  const [proxies, setProxies] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [textSearch, setTextSearch] = useState('');
  const [selectedProxy, setSelectedProxy] = useState([]);

  const generateProxyStr = (proxy) => {
    let proxyStr = `${proxy.host}:${proxy.port}${proxy.username && proxy.username != '' ? ':' + proxy.username : ''}${
      proxy.password ? ':' + proxy.password : ''
    }`;

    if (proxyStr.length > 30) {
      proxyStr = `${proxy.host}:${proxy.port}`;
    }
    return proxyStr;
  };

  useEffect(() => {
    getProxies();
  }, []);
  useEffect(() => {
    getProxies();
  }, [defaultProxies]);

  const getProxies = async () => {
    const res = null;
    if (res && res.success) {
      let listProxy = res.data.data.filter((e) => {
        if (defaultProxies) {
          const check = defaultProxies.find((o) => o.id == e.id);
          return !check;
        }
        return true;
      });
      listProxy = listProxy.map((e, index) => {
        let username = e.username;
        let password = e.password;
        if (e.encrypted) {
          username = aesDecrypt(e.username);
          password = aesDecrypt(e.password);
        }
        return { ...e, username, password, key: index + 1 };
      });
      setProxies(listProxy);
      setDataSearch(listProxy);
    }
  };

  const searchProfiles = (text) => {
    setTextSearch(text);
    if (text == '') {
      setDataSearch(proxies);
    } else {
      const newData = proxies.filter((e) => {
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

  const changeProxy = async () => {
    const listProxy = selectedProxy;
    if (listProxy.length < profilesSelected.length) {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: `Please select ${profilesSelected.length} proxy!`,
      });
    } else {
      for (let i = 0; i < profilesSelected.length; i++) {
        const res = await apiUpdateProfiles(profilesSelected[i].id, listProxy[i], profilesSelected[i].browserSource);
        if (res && res.success && res.data.code == 1) {
          const index = dataProfiles.findIndex((e) => e.id === profilesSelected[i].id);
          const newData = [...dataProfiles];
          newData[index].proxy = res.data.data.proxy;

          await dbSetLocally(storageProfiles, newData);
        }
      }
      getProfiles();
      handleCloseProxyManage();
      setTimeout(() => {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: 'The Account field is required',
        });
      }, 500);
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length) {
        console.log(selectedRows);
        setSelectedProxy(selectedRows);
      } else setSelectedProxy([]);
    },
  };
  const columnsProxys = [
    {
      title: '#',
      width: 50,
      dataIndex: 'key',
    },
    {
      title: 'Type',
      dataIndex: 'mode',
    },
    {
      title: 'Proxy',
      render: (proxy) => {
        return (
          <>
            <div className="-proxy-profiles">
              <span>{generateProxyStr(proxy)}</span>
            </div>
          </>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Location',
      render: (proxy) => {
        return (
          <>
            <div className="-proxy-profiles">
              <span>{proxy.location ? proxy.location + ',' + proxy.countryCode : proxy.location}</span>
            </div>
          </>
        );
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
    },
    {
      title: 'Expires',
      render: (proxy) => {
        return (
          <>
            <div className="-proxy-profiles">
              <span>{proxy.expireDate !== '' ? formatTimeDay(proxy.expireDate) : ''}</span>
            </div>
          </>
        );
      },
    },
  ];
  return (
    <PopupComponent
      open={openProxyManage}
      onOpen={() => {
        getProxies();
      }}
      onClose={handleCloseProxyManage}
    >
      {
        <div className="-layout-choose-scripts">
          <div className="-layout-choose-scripts__container -proxy-manage">
            <div className="-nav-scripts">
              <div className="-nav-scripts__header">
                <div className="-nav-scripts__header__close" onClick={handleCloseProxyManage}>
                  <img src={closePopup} alt="icon-x"></img>
                </div>
                <h1>PROXY MANAGEMENT</h1>
              </div>
              <div className="-wrapper-option-profiles -nav-scripts__btn">
                <button
                  onClick={() => {
                    if (selectedProxy.length == 0) {
                      Store.addNotification({
                        ...notification,
                        type: 'warning',
                        message: 'Please select proxies!',
                      });
                    } else if (!startScreen) {
                      handleAddProxyFromManager(selectedProxy);
                      handleCloseProxyManage();
                      setTimeout(() => {
                        getProxies();
                      }, 1000);
                    } else {
                      changeProxy();
                    }
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
            <div className="-container-scripts -proxy-manage__content">
              <div className="-container-scripts__right__main -proxy-manage__content__main">
                <div className="-container-scripts__right__main__search -proxy-manage__content__main__search">
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
                  <span className="-option-profiles">
                    <img
                      onClick={() => {
                        setTextSearch('');
                        getProxies();
                      }}
                      src={refresh}
                      alt="image-refresh"
                    ></img>
                  </span>
                </div>
                {/* <div className="-container-scripts__right__main__content -proxy-manage__content__main__table">
                  <div className="-container-scripts__right__main__content__table"> */}
                <Table
                  rowSelection={{
                    ...rowSelection,
                  }}
                  columns={columnsProxys}
                  dataSource={dataSearch}
                  pagination={false}
                ></Table>
                {/* </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      }
    </PopupComponent>
  );
};

export default PopupProxyManage;
