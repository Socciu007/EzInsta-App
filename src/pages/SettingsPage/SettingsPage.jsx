import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import SettingNormal from '../../components/SettingsComponent/SettingNormal/SettingNormal';
import SettingAdvenced from '../../components/SettingsComponent/SettingAdvanced/SettingAdvenced';
import SettingProxy from '../../components/SettingsComponent/SettingProxy/SettingProxy';
import { storageSettings } from '../../common/const.config';
import { v4 as uuidv4 } from 'uuid';
import { dbGetLocally, dbSetLocally } from '../../sender';
import DefaultSettings from '../../resources/defaultSettings.json';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
const SettingsPage = ({ component, handleCloseSettings }) => {
  const navigate = useNavigate();
  const [editProxy, setEditProxy] = useState(false);
  const [keyList, setKeyList] = useState(null);
  const [openProxyManage, setOpenProxyManage] = useState(false);

  const [settings, setSettings] = useState(DefaultSettings);

  useEffect(() => {
    configSettings();
  }, []);

  const configSettings = async () => {
    const setting = await dbGetLocally(storageSettings);

    if (setting) {
      setSettings(setting);
    }
  };

  useEffect(() => {
    if (settings.countProfile && settings.countProfile >= 0) {
      dbSetLocally(storageSettings, settings);
    }
  }, [settings]);

  const onChangeAssignProxy = (checked) => {
    setSettings({
      ...settings,
      assignProxy: checked,
    });
  };

  const onChangeAPIProxy = (checked) => {
    setSettings({
      ...settings,
      apiChange: checked,
    });
  };

  const handleNumberProfile = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        countProfile: settings.countProfile + 1,
      });
    } else {
      setSettings({
        ...settings,
        countProfile: settings.countProfile > 0 ? settings.countProfile - 1 : 0,
      });
    }
  };
  const onChangeNumberProfile = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setSettings({ ...settings, countProfile: parseInt(value) });
    }
  };
  //
  const handleNumberLoop = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        countLoop: settings.countLoop + 1,
      });
    } else {
      setSettings({
        ...settings,
        countLoop: settings.countLoop > 0 ? settings.countLoop - 1 : 0,
      });
    }
  };
  const onChangeNumberLoop = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setSettings({ ...settings, countLoop: parseInt(value) });
    }
  };

  const handleMaxTimePerThread = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        maxTime: settings.maxTime + 1,
      });
    } else {
      setSettings({
        ...settings,
        maxTime: settings.maxTime > 0 ? settings.maxTime - 1 : 0,
      });
    }
  };
  const onChangeMaxTimePerThread = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setSettings({ ...settings, maxTime: parseInt(value) });
    }
  };
  //
  const handleDelayInEachNewThread = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        delayThread: settings.delayThread + 1,
      });
    } else {
      setSettings({
        ...settings,
        delayThread: settings.delayThread > 0 ? settings.delayThread - 1 : 0,
      });
    }
  };
  const onChangeDelayInEachNewThread = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setSettings({ ...settings, delayThread: parseInt(value) });
    }
  };
  //
  const handlestopIfRamReaches = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        maxRam: settings.maxRam < 100 ? settings.maxRam + 1 : 100,
      });
    } else {
      setSettings({
        ...settings,
        maxRam: settings.maxRam > 0 ? settings.maxRam - 1 : 0,
      });
    }
  };
  const onChangeStopIfRamReaches = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    let value = e.target.value && e.target.value !== '' ? e.target.value : 0;

    if (!isNaN(value) && decimalRegex.test(value)) {
      if (value < 0) value = 0;
      if (value > 100) value = 100;
      setSettings({ ...settings, maxRam: parseInt(value) });
    }
  };
  //
  const handleStopIfCPUReaches = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        maxCpu: settings.maxCpu < 100 ? settings.maxCpu + 1 : 100,
      });
    } else {
      setSettings({
        ...settings,
        maxCpu: settings.maxCpu > 0 ? settings.maxCpu - 1 : 0,
      });
    }
  };
  const onChangeStopIfCPUReaches = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    let value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      if (value < 0) value = 0;
      if (value > 100) value = 100;
      setSettings({ ...settings, maxCpu: parseInt(value) });
    }
  };
  //
  const handleStopIfDiskReaches = (type) => {
    if (type === 'increase') {
      setSettings({
        ...settings,
        maxDisk: settings.maxDisk < 100 ? settings.maxDisk + 1 : 100,
      });
    } else {
      setSettings({
        ...settings,
        maxDisk: settings.maxDisk > 0 ? settings.maxDisk - 1 : 0,
      });
    }
  };
  const onChangeStopIfDiskReaches = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    let value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      if (value < 0) value = 0;
      if (value > 100) value = 100;
      setSettings({ ...settings, maxDisk: parseInt(value) });
    }
  };

  const handleOnChangeTypeProfile = (event) => {
    setSettings({
      ...settings,
      runningType: event.target.value,
    });
  };
  const handleOnChangeMuteaudio = (value) => {
    setSettings({
      ...settings,
      muteAudio: value,
    });
  };
  const handleOnChangeShowImage = (value) => {
    setSettings({
      ...settings,
      showImage: value,
    });
  };
  //
  const handleOnchangeUrl = (value) => {
    setSettings({
      ...settings,
      URL: value,
    });
  };
  //proxy
  const handleOpenProxyManage = () => {
    setOpenProxyManage(true);
  };
  const handleCloseProxyManage = () => {
    setOpenProxyManage(false);
  };
  const handleOpenEdit = (key) => {
    setKeyList(key);
    setEditProxy(true);
  };
  const handleCloseEdit = () => {
    setKeyList(null);
    setEditProxy(false);
  };
  const handleOpenWriteText = (o) => {
    setOpenWriteText(!o);
  };

  const handleAddProxyFromManager = (listProxy) => {
    if (listProxy.length) {
      const proxies = settings.proxies;
      listProxy.forEach((proxy) => {
        proxies.push(proxy);
      });
      setSettings({ ...settings, proxies });
      setStatusMessage('success');

      Store.addNotification({
        ...notification,
        type: 'success',
        message: 'Import proxies success!',
      });
    }
  };

  const handleAddProxy = (proxyString, type) => {
    if (keyList) {
      const listProxyString = proxyString.split('\n');
      const listProxy = [];
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
            mode: type,
            id: uuidv4(),
          });
        }
      });

      if (listProxy.length == 0) {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: 'Malformed proxies!',
        });
      } else {
        const proxies = settings.proxies;
        const index = proxies.findIndex((e) => e.id == keyList);
        if (index >= 0) {
          proxies[index] = listProxy[0];
          setSettings({ ...settings, proxies });
          Store.addNotification({
            ...notification,
            type: 'success',
            message: 'Change proxies success!',
          });
        }
      }
    } else {
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
              mode: type,
              id: uuidv4(),
            });
          }
        });
        if (listProxy.length == 0) {
          Store.addNotification({
            ...notification,
            type: 'warning',
            message: 'Malformed proxies!',
          });
        } else {
          const proxies = settings.proxies;
          listProxy.forEach((proxy) => {
            proxies.push(proxy);
          });
          setSettings({ ...settings, proxies });
          Store.addNotification({
            ...notification,
            type: 'success',
            message: 'Import proxies success!',
          });
        }
      } else {
        Store.addNotification({
          ...notification,
          type: 'warning',
          message: 'Please type proxies!',
        });
      }
    }
  };

  const handleDeleteProxy = (id) => {
    const newProxies = settings.proxies.filter((e) => e.id !== id);
    setSettings({ ...settings, proxies: newProxies });
    Store.addNotification({
      ...notification,
      type: 'success',
      message: 'Delete proxies success!',
    });
  };

  const onChangeProxy = (proxy, id) => {
    const index = settings.proxies.findIndex((e) => e.id == id);
    if (index >= 0) {
      if (proxy.includes(':')) {
        const host = proxy.split(':')[0];
        const port = proxy.split(':')[1];
        const username = proxy.split(':')[2] ? proxy.split(':')[2] : '';
        const password = proxy.split(':')[3] ? proxy.split(':')[3] : '';
        const newProxy = {
          host,
          port,
          username,
          password,
          mode: settings.proxies[index].mode ? settings.proxies[index].mode : 'http',
          id,
        };

        const newListProxy = [...settings.proxies];
        newListProxy[index] = newProxy;
        setSettings({ ...settings, proxies: newListProxy });
      }
    }
  };

  return (
    <div
      className={`layout-settings ${!component ? 'layout-settings-Page' : 'layout-settings-Dialog'}`}
      style={{ opacity: openProxyManage ? 0.3 : 1 }}
    >
      <div className="-layout-page">
        <h1 className="-title-profiles">EzInsta</h1>
        <div className="-return-profiles">
          <span
            //   onClick={
            //     () => navigate('/')
            // }
            onClick={() => {
              if (!component) {
                navigate('/');
              } else {
                handleCloseSettings();
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="15" r="15" fill="#F5F5F5" />
              <path
                d="M14.25 20.25L9 15.75M9 15.75L14.25 11.25M9 15.75L20.625 15.75"
                stroke="#01162B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="-btn-profiles">Automation settings</p>
        </div>
        <div className={`scroll-settings ${!component ? 'Page' : 'Dialog'}`}>
          <div className="-container-content">
            <div className="-settings-profiles">
              <SettingNormal
                settings={settings}
                handleNumberProfile={handleNumberProfile}
                onChangeNumberProfile={onChangeNumberProfile}
                onChangeNumberLoop={onChangeNumberLoop}
                handleOnChangeMuteaudio={handleOnChangeMuteaudio}
                handleOnChangeShowImage={handleOnChangeShowImage}
                handleNumberLoop={handleNumberLoop}
                handleOnChangeTypeProfile={handleOnChangeTypeProfile}
                handleOnchangeUrl={handleOnchangeUrl}
              ></SettingNormal>
              <SettingAdvenced
                settings={settings}
                handleDelayInEachNewThread={handleDelayInEachNewThread}
                handleMaxTimePerThread={handleMaxTimePerThread}
                handleStopIfCPUReaches={handleStopIfCPUReaches}
                handleStopIfDiskReaches={handleStopIfDiskReaches}
                handlestopIfRamReaches={handlestopIfRamReaches}
                onChangeDelayInEachNewThread={onChangeDelayInEachNewThread}
                onChangeMaxTimePerThread={onChangeMaxTimePerThread}
                onChangeStopIfCPUReaches={onChangeStopIfCPUReaches}
                onChangeStopIfDiskReaches={onChangeStopIfDiskReaches}
                onChangeStopIfRamReaches={onChangeStopIfRamReaches}
              ></SettingAdvenced>
            </div>
            <SettingProxy
              data={settings.proxies ? settings.proxies : []}
              settings={settings}
              keyList={keyList}
              editProxy={editProxy}
              openProxyManage={openProxyManage}
              handleOpenEdit={handleOpenEdit}
              handleCloseEdit={handleCloseEdit}
              handleOpenProxyManage={handleOpenProxyManage}
              handleCloseProxyManage={handleCloseProxyManage}
              handleAddProxy={handleAddProxy}
              onChangeAssignProxy={onChangeAssignProxy}
              onChangeAPIProxy={onChangeAPIProxy}
              handleDeleteProxy={handleDeleteProxy}
              onChangeProxy={onChangeProxy}
              handleAddProxyFromManager={handleAddProxyFromManager}
            ></SettingProxy>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
