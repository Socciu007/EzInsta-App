import React, { useEffect, useState } from 'react';

import './style.scss';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import Dialog from '@mui/material/Dialog';
import { Store } from 'react-notifications-component';
import notification from '../../../resources/notification.json';
import search from '../../../assets/pictures/icon-search.svg';
import { Table, Tooltip } from 'antd';
import closePopup from '../../../assets/pictures/icon-x.svg';
import pin from '../../../assets/pictures/icon-pin.svg';
import { storageProfiles } from '../../../common/const.config';
import { dbGetLocally, getProfilesMarco } from '../../../sender';
import storageService from '../../../services/storage.service';
import { useSelector } from 'react-redux';
import { runScript } from '../../../services/runScript';
import { useDispatch } from 'react-redux';
import { removeDebug } from '../../../redux/debugSlice';
const PopupChooseProfile = ({ openProfiles, handleCloseProfiles, designScript }) => {
  const dispatch = useDispatch();
  const makeCopyProfile = {
    position: 'fixed',
    maxWidth: '100%',
    width: '1163px',
    height: '679px',
    top: '50%',
    left: '50%',
    transform: ' translate(-50%, -50%)',
    borderRadius: '15px',
    background: '#fff',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    flexShrink: '0',
    zIndex: '99999',
    margin: '0',
    overflow: 'inherit !important',
  };

  const overlay = {
    background: 'rgba(255,255,255,0.9)',
  };
  const MuiDialogPaperProfile = {
    width: '1163px',
    height: '679px',
    maxHeight: '679px !important',
    minWidth: '1163px !important',
    color: '#01162b !important',
  };
  const MuiDialogContainerProfile = {
    display: 'block',
  };

  const profiles = useSelector((state) => state.profile);

  let loading = false;
  const [profilesSelected, setProfilesSelected] = useState([]);
  const [dataProfiles, setDataProfiles] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    config();
  }, []);

  useEffect(() => {
    const newData = [...dataSearch];
    profiles.forEach((e) => {
      const index = newData.findIndex((o) => o.id == e.id);
      if (index >= 0) newData[index] = { ...newData[index], status: e.status };
    });

    const newDataSelected = [...profilesSelected];
    profiles.forEach((e) => {
      const index = newDataSelected.findIndex((o) => o.id == e.id);
      if (index >= 0) newDataSelected[index] = { ...newDataSelected[index], status: e.status };
    });
    setDataSearch(newData);
    setProfilesSelected(newDataSelected);
  }, [profiles]);

  const config = async () => {
    await getProfiles(true);
  };

  const generateNoteStr = (note, shot = true, length = 75) => {
    let noteStr = note && note.length ? `${note}` : '';

    if (noteStr.length > length && shot) {
      noteStr = `${note.slice(0, length)}...`;
    }
    return noteStr;
  };

  const columns = [
    {
      title: '#',
      width: 40,
      render: (text, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'UID',
      render: (profile) => {
        return (
          <div className="-text-profile">
            <span>{profile.uid}</span>
            {profile.isPin && <img src={pin} alt="icon-pin"></img>}
          </div>
        );
      },
      width: 120,
      sorter: (a, b) => {
        if (!a.isPin && !b.isPin) {
          const nameA = a.uid ? a.uid.toUpperCase() : '';
          const nameB = b.uid ? b.uid.toUpperCase() : '';
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
    },
    {
      title: 'Name',
      dataIndex: 'nameAccount',
      width: 100,
      render: (nameAccount) => (
        <Tooltip placement="topLeft" title={nameAccount}>
          {nameAccount}
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 70,
      render: (status) => {
        if (status === 'ready') {
          return (
            <div className="-status-profiles -status-profiles-ready">
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
      width: 120,
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
      sorter: (a, b) => {
        if (!a.isPin && !b.isPin) {
          const nameA = a.name ? a.name.toUpperCase() : '';
          const nameB = b.name ? b.name.toUpperCase() : '';
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      width: 150,
      render: (tag) => (
        <Tooltip placement="topLeft" title={generateNoteStr(tag, false)}>
          <p className="-tag-script">{generateNoteStr(tag, true, 2)}</p>
        </Tooltip>
      ),
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
    },
  ];

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
      profiles.forEach((e) => {
        const index = newData.findIndex((o) => o.id == e.id);
        if (index >= 0) newData[index] = { ...newData[index], status: e.status };
      });
      newData = newData.map((e) => {
        return { ...e, isPin: e.isPin ? true : false };
      });
      newData = newData.sort((x, y) => Number(y.isPin) - Number(x.isPin));
      setDataSearch(
        newData.map((e, index) => {
          return { ...e, key: index + 1 };
        }),
      );
    }
  }, [dataProfiles]);

  const getProfiles = async (local = false) => {
    if (!loading) {
      loading = true;
      let profilesFromServer;
      if (local) {
        profilesFromServer = storageService.getSessionObject('profiles');
      }

      if (!profilesFromServer) profilesFromServer = await getProfilesMarco();
      if (profilesFromServer && profilesFromServer.code) {
        storageService.setSessionObject('profiles', profilesFromServer);
        let profiles = await dbGetLocally(storageProfiles);
        profiles = profiles.filter((e) => {
          const check = profilesFromServer.result.find((o) => o.id == e.id);
          if (check) return true;
          return false;
        });

        if (profiles && profiles.length) {
          setDataProfiles(profiles);
          setDataSearch(
            profiles.map((e, index) => {
              return { ...e, key: index + 1 };
            }),
          );
        }
      }
      loading = false;
    }
  };

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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRows && selectedRows.length) setProfilesSelected(selectedRows);
      else setProfilesSelected([]);
    },
  };

  const searchProfiles = (text) => {
    if (text == '') {
      const newData = dataProfiles.sort((x, y) => Number(y.isPin) - Number(x.isPin));
      setDataSearch(
        newData.map((e, index) => {
          return { ...e, key: index + 1 };
        }),
      );
    } else {
      const newProfiles = dataProfiles.filter((e) => {
        const profile = e.uid.toLowerCase();
        const mail = e.recoveryEmail ? e.recoveryEmail.toLowerCase() : '';
        const name = e.nameAccount ? e.nameAccount.toLowerCase() : '';
        const tags = e.tag ? e.tag.join(',').toLowerCase() : '';
        const proxy = generateProxyStr(e.proxy, false).toLowerCase();
        return (
          profile.includes(text.toLowerCase()) ||
          name.includes(text.toLowerCase()) ||
          mail.includes(text.toLowerCase()) ||
          tags.includes(text.toLowerCase()) ||
          proxy.includes(text.toLowerCase())
        );
      });
      const newData = newProfiles.sort((x, y) => Number(y.isPin) - Number(x.isPin));
      setDataSearch(
        newData.map((e, index) => {
          return { ...e, key: index + 1 };
        }),
      );
    }
  };

  const runScriptAuto = async () => {
    if (profilesSelected.length == 0) {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Please choose profile!',
      });
    } else {
      const check = profilesSelected.find((e) => e.status !== 'ready');
      if (!check) {
        handleCloseProfiles();
        setSelectedRowKeys([]);
        dispatch(removeDebug());
        await runScript(profilesSelected, designScript, dispatch);
      } else {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: `Profile ${check.uid} is ${check.status}!`,
        });
      }
    }
  };

  return (
    <>
      <Dialog
        open={openProfiles}
        onClose={() => {
          setSelectedRowKeys([]);
          setProfilesSelected([]);
          handleCloseProfiles();
        }}
        sx={{
          '& .MuiPaper-root[role="dialog"]': makeCopyProfile,
          '& .MuiBackdrop-root': overlay,
          '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': MuiDialogPaperProfile,
          '& .MuiDialog-container': MuiDialogContainerProfile,
        }}
      >
        <div className="choose-profile">
          <div className="choose-profile__container">
            <div className="-nav-scripts">
              <div className="-nav-scripts__header">
                <div
                  className="-nav-scripts__header__close"
                  onClick={() => {
                    setSelectedRowKeys([]);
                    setProfilesSelected([]);
                    handleCloseProfiles();
                  }}
                >
                  <img src={closePopup} alt="icon-x"></img>
                </div>
                <h1>CHOOSE PROFILES</h1>
              </div>
              <div className="-wrapper-option-profiles -nav-scripts__btn">
                <div className="-search-profiles">
                  <span>
                    <img src={search} alt="search" style={{ marginLeft: '11px' }}></img>
                  </span>
                  <input
                    onChange={(event) => {
                      searchProfiles(event.target.value);
                    }}
                    placeholder="Search..."
                  ></input>
                </div>
                <button
                  onClick={async () => {
                    await runScriptAuto();
                  }}
                >
                  RUN
                </button>
              </div>
            </div>
            <div className="scrollable-container">
              <Table
                rowSelection={{
                  ...rowSelection,
                  type: 'radio',
                }}
                showSorterTooltip={false}
                rowClassName={(profile) => (profile.isPin ? 'editable-row pinned-row' : 'editable-row')}
                columns={columns}
                dataSource={dataSearch}
                scroll={{ x: 558 }}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PopupChooseProfile;
