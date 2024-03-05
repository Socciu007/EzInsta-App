import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import { Input, Popover, Table, Tooltip } from 'antd';
import display from '../../assets/pictures/icon-display-setting.png';
import search from '../../assets/pictures/icon-search.svg';
import refresh from '../../assets/pictures/icon-refresh.png';
import settings from '../../assets/pictures/icon-settings.png';
import addPerson from '../../assets/icon/icon-addPerson.png';
import addFile from '../../assets/icon/icon-addFile.svg';
import options from '../../assets/pictures/icon-options.png';
import addProxy from '../../assets/pictures/icon-addProxy.png';
import deleted from '../../assets/icon/icon-Delete.svg';
import yourScript from '../../assets/pictures/icon-yourScripts.svg';
import pin from '../../assets/icon/icon-pin.svg';
import pinBlack from '../../assets/icon/icon-pinBlack.svg';
import avatar from '../../assets/icon/icon-avatar.svg';
import activeProfile from '../../assets/icon/icon-profileTotal.svg';
import logout from '../../assets/icon/icon-logOut.svg';
import defaultSettings from '../../resources/defaultSettings.json';
import defaultDisplaySettings from '../../resources/defaultDisplaySettings.json';
import { EditableCell, EditableRow } from '../../components/EditableTable/EditableTable';
import PopupProfile from '../../components/PopupHome/PopupProfile/PopupProfile';
import PopupAddProxy from '../../components/PopupHome/PopupAddProxy/PopupAddProxy';
import PopupProxyManage from '../../components/PopupHome/PopupProxyManage/PopupProxyManage';
import PopupDeleteProfile from '../../components/PopupHome/PopupDeleteProfile/PopupDeleteProfile';
import PopupScript from '../../components/PopupHome/PopupScript/PopupScript';
import { accessToken, storageDisplaySettings, storageProfiles, storageSettings } from '../../common/const.config';
import PopupDisplaySetting from '../../components/PopupHome/PopupDisplaySetting/PopupDisplaySetting';
import { dbGetLocally, dbSetLocally, deleteProfile, getMe, getProfilesMarco, runProfile } from '../../sender';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
import { Menu } from '@mui/material';
import storageService from '../../services/storage.service';
import { formatTimeDay } from '../../services/utils';
import { useSelector, useDispatch } from 'react-redux';
import { setDebug } from '../../redux/debugSlice';
const ProfilesPage = () => {
  const profiles = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  let rowID;
  let loading = false;
  const [columns, setColumns] = useState([]);
  const [idSelect, setIdSelect] = useState(null);
  const [displaySettings, setDisplaySettings] = useState(null);
  const [profilesSelected, setProfilesSelected] = useState([]);
  const [dataProfiles, setDataProfiles] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [openScripts, setOpenScripts] = useState(false);
  const [openDisplaySetting, setOpenDisplaySetting] = useState(false);
  const [openProfiles, setOpenProfiles] = useState(false);
  const [openAddProxy, setOpenAddProxy] = useState(false);
  const [openDeleteProfile, setOpenDeleteProfile] = useState(false);
  const [openProxyManage, setOpenProxyManage] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  if (!window.electron.ipcRenderer.eventNames().includes('ipc-logger')) {
    window.electron.ipcRenderer.on('ipc-logger', (...params) => {
      if (params[0].length == 3 && params[0][1] && params[0][2] && params[0][2].toString().includes('Update name:')) {
        const name = params[0][2].split('|')[0].replace('Update name:', '');
        const friend = params[0][2].split('|')[1] ? params[0][2].split('|')[1] : '';
        updateAccount(params[0][1], name, friend);
      }

      if (params[0][1] && params[0][1].toString().includes('Debug|')) {
        updateDebugLog(params[0][0], params[0][1]);
      }

      if (params[0][1] && params[0][1].toString().includes('Delete Cookie|')) {
        deleteCookie(params[0][1].split('|')[1]);
      }

      console.log(params[0]);
    });
  }

  const deleteCookie = async (cookies) => {
    const profiles = await dbGetLocally(storageProfiles);
    const index = profiles.findIndex((e) => e.cookies == cookies);
    if (index >= 0) {
      const profile = profiles[index];
      profiles.splice(index, 1, {
        ...profile,
        cookies: '',
      });
      await dbSetLocally(storageProfiles, profiles);
    }
  };

  const updateDebugLog = async (uid, log) => {
    const script = log.split('|')[1] ? log.split('|')[1] : '';
    const err = log.split('|')[2] ? log.split('|')[2] : '';
    const profiles = await dbGetLocally(storageProfiles);
    const profile = profiles.find((e) => e.uid == uid);
    const name = profile ? (profile.nameAccount ? profile.nameAccount : uid) : '';
    dispatch(
      setDebug({
        name,
        err,
        script,
      }),
    );
  };

  const updateAccount = async (id, accountName, friends) => {
    const newData = await dbGetLocally(storageProfiles);
    const index = newData.findIndex((profile) => id == profile.id);
    if (index >= 0) {
      const profile = newData[index];
      console.log(profile);
      profile.nameAccount = accountName;
      profile.friends = friends;
      newData.splice(index, 1, {
        ...profile,
      });
      await dbSetLocally(storageProfiles, newData);
    }
  };

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
    await checkSettings();
    await getProfiles(true);
    await getUser();
  };

  const getUser = async () => {
    let userProfile;
    userProfile = storageService.getSessionObject('user');
    if (!userProfile || userProfile.code !== 1) userProfile = await getMe();
    if (userProfile && userProfile.code == 1) {
      storageService.setSessionObject('user', userProfile);
      setUser(userProfile.result);
    }
  };

  const checkSettings = async () => {
    const token = await dbGetLocally(accessToken);
    if (!token || token == '') {
      return navigate('/login');
    }
    const settings = await dbGetLocally(storageSettings);
    if (!settings) {
      await dbSetLocally(storageSettings, defaultSettings);
    }

    let display = await dbGetLocally(storageDisplaySettings);
    if (!display) {
      await dbSetLocally(storageDisplaySettings, defaultDisplaySettings);
      display = defaultDisplaySettings;
    }
    setDisplaySettings(display);
  };

  const renderColumns = async (settings, data) => {
    if (!settings) settings = await dbGetLocally(storageDisplaySettings);
    const settingsColumns = [
      {
        title: '#',
        width: 50,
        render: (text, record, index) => <div>{index + 1}</div>,
      },
    ];

    if (settings.name) {
      settingsColumns.push({
        title: 'User Name',
        index: 'name',
        render: (profile) => {
          return (
            <div className="-text-profile">
              <span>{profile.name}</span>
              {profile.isPin && <img src={pin} alt="icon-pin"></img>}
            </div>
          );
        },
        width: 200,
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
      });
    }
    if (settings.password) {
      settingsColumns.push({
        title: 'Password',
        dataIndex: 'password',
        width: 150,
        ellipsis: {
          showTitle: false,
        },
        render: (password) => (
          <Tooltip placement="topLeft" title={password}>
            {password}
          </Tooltip>
        ),
      });
    }
    if (settings.status) {
      settingsColumns.push({
        title: 'Status',
        dataIndex: 'status',
        width: 100,
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
      });
    }
    if (settings.follower) {
      settingsColumns.push({
        title: 'Follower/ Following',
        dataIndex: 'follower',
        width: 170,
        ellipsis: {
          showTitle: false,
        },
        render: (follower) => (
          <Tooltip placement="topLeft" title={follower}>
            {follower}
          </Tooltip>
        ),
      });
    }
    if (settings.email) {
      settingsColumns.push({
        title: 'Email',
        dataIndex: 'recoveryEmail',
        width: 250,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => {
          if (!a.isPin && !b.isPin) {
            const nameA = a.recoveryEmail ? a.recoveryEmail.toUpperCase() : '';
            const nameB = b.recoveryEmail ? b.recoveryEmail.toUpperCase() : '';
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          }
        },
        render: (recoveryEmail) => (
          <Tooltip placement="topLeft" title={recoveryEmail}>
            {recoveryEmail}
          </Tooltip>
        ),
      });
    }
    if (settings.emailPass) {
      settingsColumns.push({
        title: `Email's password`,
        dataIndex: 'recoveryPassword',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (recoveryPassword) => (
          <Tooltip placement="topLeft" title={recoveryPassword}>
            {recoveryPassword}
          </Tooltip>
        ),
      });
    }
    if (settings.twoFA) {
      settingsColumns.push({
        title: '2FA',
        dataIndex: 'twoFA',
        width: 200,
        ellipsis: {
          showTitle: false,
        },
        render: (twoFA) => (
          <Tooltip placement="topLeft" title={twoFA}>
            {twoFA}
          </Tooltip>
        ),
      });
    }
    if (settings.tag) {
      settingsColumns.push({
        title: 'Tag',
        dataIndex: 'tag',
        width: 200,
        editable: true,
        render: (tag) => {
          return <Input name="tag" value={tag} className="-tag-profiles" onChange={(e) => e.target.value}></Input>;
        },
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
      });
    }
    settingsColumns.push({
      width: 50,
      fixed: 'right',
      render: (profile) => {
        const handleClickRemove = () => {
          if (profile.id !== '') {
            setIdSelect(profile.id);
            setOpenDeleteProfile(true);
          } else {
            Store.addNotification({
              ...notification,
              type: 'warning',
              message: 'Please select profile!',
            });
          }
        };
        return (
          <div
            className="-expand-icon"
            onClick={() => {
              rowID = profile.id;
              renderColumns();
            }}
          >
            <Popover
              open={rowID == profile.id}
              trigger="hover"
              onOpenChange={handleCloseAction}
              placement="rightTop"
              content={
                <div className="-popover-options">
                  <div
                    onClick={() => {
                      handleCloseAction();
                      pinProfile(profile.id, data ? data : dataProfiles);
                    }}
                    className="-popover-options__attribute border-bottom"
                  >
                    <img src={pinBlack} alt="icon-pin"></img>
                    {!profile.isPin ? <p>Pin</p> : <p>Unpin</p>}
                  </div>
                  <div
                    onClick={() => {
                      handleCloseAction();
                      handleClickRemove();
                    }}
                    className="-popover-options__attribute"
                  >
                    <img src={deleted} alt="icon-deleted"></img>
                    <p>Remove</p>
                  </div>
                </div>
              }
            >
              <img src={options} alt="image-option"></img>
            </Popover>
          </div>
        );
      },
    });
    const newColumns = settingsColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSaveTag,
        }),
      };
    });
    setColumns(newColumns);
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
    if (displaySettings && dataProfiles) {
      renderColumns(displaySettings, dataProfiles);
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
        if (profiles && profiles.length)
          profiles = profiles.filter((e) => {
            const check = profilesFromServer.result.find((o) => o.id == e.id);
            if (check) return true;
            return false;
          });

        if (profiles && profiles.length) {
          console.log(profiles);
          setDataProfiles(profiles);
          setDataSearch(
            profiles.map((e, index) => {
              return { ...e, key: index + 1 };
            }),
          );
        } else {
          setDataProfiles([]);
        }
      }
      storageService.setSessionObject('user', null);
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

  const pinProfile = async (id, data) => {
    const index = data.findIndex((e) => e.id == id);

    let newDataProfile = [...data];
    if (index < 0) return;

    newDataProfile[index].isPin = !newDataProfile[index].isPin;
    setDataProfiles(newDataProfile);
    await dbSetLocally(storageProfiles, newDataProfile);
  };
  const removeProfile = async (id) => {
    await deleteProfile(id);
    const newData = dataProfiles.filter((e) => e.id !== id);
    setDataProfiles(newData);
    await dbSetLocally(storageProfiles, newData);
    Store.addNotification({
      ...notification,
      type: 'success',
      message: 'Removed account',
    });
    setOpenDeleteProfile(false);
    setProfilesSelected([]);
    setSelectedRowKeys([]);
    setIdSelect(null);
  };

  const handleCloseAction = () => {
    rowID = null;
    renderColumns();
  };

  const handleSaveTag = async (row) => {
    if (row && row.tag && row.tag.length) {
      const newData = [...dataProfiles];
      const index = newData.findIndex((profile) => row.id === profile.id);
      const profile = newData[index];
      profile.tag = row.tag
        .toString()
        .split(',')
        .map((e) => {
          if (e && e.length && !e.startsWith('#')) {
            return '#' + e.toString().trim();
          }
          return e;
        });
      newData.splice(index, 1, {
        ...profile,
      });
      setDataProfiles(newData);
      await dbSetLocally(storageProfiles, newData);
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRows && selectedRows.length) setProfilesSelected(selectedRows);
      else setProfilesSelected([]);
    },
  };

  const handleSettings = () => {
    navigate('/settings');
  };
  const handleScript = () => {
    navigate('/scripManager');
  };

  const handleReloadPage = async () => {
    await getProfiles();
    await getUser();
    setProfilesSelected([]);
    setSelectedRowKeys([]);
    Store.addNotification({
      ...notification,
      type: 'success',
      message: 'Reloaded Profiles',
    });
  };
  //scripts
  const handleOpenScripts = () => {
    if (profilesSelected.length > 0) {
      const check = profilesSelected.find((e) => e.status !== 'ready' && !e.status.toLowerCase().includes('error'));
      if (!check) {
        setOpenScripts(true);
      } else {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: `Profile ${check.uid} is ${check.status}!`,
        });
      }
    } else {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Please select profile!',
      });
    }
  };
  const handleCloseScripts = () => {
    setOpenScripts(false);
  };
  //profiles
  const handleOpenProfiles = () => {
    setOpenProfiles(true);
  };
  const handleCloseProfiles = () => {
    setOpenProfiles(false);
  };
  //display setting
  const handleOpenDisplaySetting = () => {
    setOpenDisplaySetting(true);
  };
  const handleCloseDisplaySetting = () => {
    setOpenDisplaySetting(false);
  };
  const onSaveDisplaySettings = async (settings) => {
    await dbSetLocally(storageDisplaySettings, settings);
    setDisplaySettings(settings);
    renderColumns(settings);
  };
  //proxy
  const handleOpenProxyManage = () => {
    setOpenProxyManage(true);
  };
  const handleCloseProxyManage = () => {
    setOpenAddProxy(true);
    setOpenProxyManage(false);
  };
  const handleCloseAdd = () => {
    setOpenAddProxy(false);
  };
  const handleCloseDelete = () => {
    setOpenDeleteProfile(false);
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

  const handleRemoveProfiles = async () => {
    for (let i = 0; i < profilesSelected.length; i++) {
      await deleteProfile(profilesSelected[i].id);
    }

    const newData = dataProfiles.filter((e) => {
      const check = profilesSelected.find((o) => o.id === e.id);
      return !check;
    });
    setDataProfiles(newData);
    const newDataSearch = dataSearch.filter((e) => {
      const check = profilesSelected.find((o) => o.id == e.id);
      return !check;
    });
    setDataSearch(
      newDataSearch.map((e, index) => {
        return { ...e, key: index + 1 };
      }),
    );
    setProfilesSelected([]);
    setSelectedRowKeys([]);
    await dbSetLocally(storageProfiles, newData);
    Store.addNotification({
      ...notification,
      type: 'success',
      message: 'Removed account',
    });
    handleCloseDelete();
    await getProfiles();
    await getUser();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userMenu = {
    borderRadius: '10px',
  };

  return (
    <div
      className="layout-profiles"
      style={{
        opacity:
          openAddProxy || openDeleteProfile || openScripts || openProfiles || openProxyManage || openDisplaySetting
            ? 0.1
            : 1,
      }}
    >
      <div className="-container-profiles">
        <div className="profiles_header">
          <h1 className="-title-profiles">MiniTool Instagram</h1>
          <div className="user">
            {/* <p className="user_noti">
              Your subscription will be expired in <strong>3 days</strong>. <span>Pay now!</span>
            </p> */}
            <img
              src={avatar}
              alt="avatar"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            />
            <div>
              <Menu
                className="userMenu"
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                sx={{
                  '& .MuiPaper-root': userMenu,
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <div className="userPopup MuiBox-root css-0">
                  <div className="email">{user ? user.email : ''}</div>
                  <div className="profileStatus">
                    <img src={activeProfile} alt="icon active profile" />
                    <span>{user ? user.profiles : ''}</span>
                    <span>/{user ? user.plan.maxProfiles : ''} profiles</span>
                  </div>
                  <div className="plan">
                    <div className="textPlan">
                      <p>{user ? user.plan.name : ''}</p>
                      <p>Exp: {user ? formatTimeDay(user.planExpireDate) : ''}</p>
                    </div>
                    <div style={{ lineHeight: '45px' }}>
                      <button className="btnUpgrade">Upgrade</button>
                    </div>
                  </div>
                  {/* <div className="myProfile">
                    <div className="img-user">
                      <img src={myProfile} alt="icon my profile" />
                    </div>
                    <p>My profile</p>
                  </div>
                  <div className="payment">
                    <div className="img-user">
                      <img src={payment} alt="icon Payment history" />
                    </div>
                    <p>Payment history</p>
                  </div> */}
                  <div
                    className="logout"
                    onClick={async () => {
                      storageService.setSessionObject('profiles', null);
                      storageService.setSessionObject('user', null);
                      await dbSetLocally(accessToken, null);
                      return navigate('/login');
                    }}
                  >
                    <div className="img-user">
                      <img src={logout} alt="icon Log out" />
                    </div>
                    <p>Log out</p>
                  </div>
                </div>
              </Menu>
            </div>
          </div>
        </div>
        <div className="-nav-profiles">
          <div className="-subnav-profiles">
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
            <div className="-wrapper-option-profiles">
              <span className="-option-profiles" onClick={handleReloadPage}>
                <img src={refresh} alt="image-refresh"></img>
              </span>
              <span className="-option-profiles" onClick={handleOpenDisplaySetting}>
                <img src={display} alt="display-setting"></img>
              </span>
              <PopupDisplaySetting
                onSaveDisplaySettings={onSaveDisplaySettings}
                openDisplaySetting={openDisplaySetting}
                displaySettings={displaySettings}
                handleCloseDisplaySetting={handleCloseDisplaySetting}
              ></PopupDisplaySetting>
              <span className="-option-profiles" onClick={handleSettings}>
                <img src={settings} alt="image-settings"></img>
              </span>
              <span className="-option-profiles" onClick={handleScript}>
                <img src={yourScript} alt="icon-yourscripts"></img>
              </span>
              <span className="-option-profiles" onClick={handleOpenProfiles}>
                <img src={addPerson} alt="image-addPerson"></img>
              </span>
              <span className="-option-profiles" onClick={() => {}}>
                <img src={addFile} alt="image-addFile"></img>
              </span>
              <PopupProfile
                openProfiles={openProfiles}
                handleCloseProfiles={handleCloseProfiles}
                onAddProfile={async () => {
                  await getProfiles();
                  await getUser();
                }}
              ></PopupProfile>
            </div>
          </div>
          <div className="-btn-profiles">
            {profilesSelected.length ? (
              <div
                className="-select-profile"
                onClick={() => {
                  if (profilesSelected.length > 0) {
                    setOpenAddProxy((o) => !o);
                  } else {
                    Store.addNotification({
                      ...notification,
                      type: 'warning',
                      message: 'Please select profile!',
                    });
                  }
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={addProxy} alt="icon-add-proxy" width={15} height={15}></img>
                </div>
                <p>Add Proxy</p>
              </div>
            ) : null}
            <PopupAddProxy
              profilesSelected={profilesSelected}
              getProfiles={getProfiles}
              dataProfiles={dataProfiles}
              openAddProxy={openAddProxy}
              handleCloseAdd={handleCloseAdd}
              handleOpenProxyManage={handleOpenProxyManage}
            ></PopupAddProxy>
            <PopupProxyManage
              startScreen={'Home'}
              profilesSelected={profilesSelected}
              getProfiles={getProfiles}
              dataProfiles={dataProfiles}
              openProxyManage={openProxyManage}
              handleCloseProxyManage={handleCloseProxyManage}
            ></PopupProxyManage>
            {profilesSelected.length ? (
              <div
                className="-select-profile"
                onClick={() => {
                  if (profilesSelected.length > 0) {
                    setOpenDeleteProfile((o) => !o);
                  } else {
                    Store.addNotification({
                      ...notification,
                      type: 'warning',
                      message: 'Please select profile!',
                    });
                  }
                }}
              >
                <div>
                  <img src={deleted} alt="icon-delete"></img>
                </div>
                <p>Remove</p>
              </div>
            ) : null}
            <PopupDeleteProfile
              openDeleteProfile={openDeleteProfile}
              handleCloseDelete={handleCloseDelete}
              handleRemove={() => {
                if (!idSelect) {
                  handleRemoveProfiles();
                } else {
                  removeProfile(idSelect);
                }
              }}
              profileSelected={profilesSelected}
            ></PopupDeleteProfile>
            <div onClick={handleOpenScripts}>
              <button>Run</button>
            </div>
            <PopupScript
              profilesSelected={profilesSelected}
              openScripts={openScripts}
              handleCloseScripts={handleCloseScripts}
              handleSettings={handleSettings}
              handleOpenScripts={handleScript}
            ></PopupScript>
          </div>
        </div>
        {/* <div className="-content-profiles">
          <div className="scrollable-container"> */}
        <Table
          rowSelection={{
            ...rowSelection,
          }}
          components={components}
          showSorterTooltip={false}
          rowClassName={(profile) => (profile.isPin ? 'editable-row pinned-row' : 'editable-row')}
          columns={columns}
          dataSource={dataSearch}
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ProfilesPage;
