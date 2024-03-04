import { Switch } from 'antd';
import './style.scss';
import up from '../../../assets/pictures/icon-Increase.svg';
import down from '../../../assets/pictures/icon-Descrease.svg';
import React from 'react';
import { MenuItem, Select } from '@mui/material';

const SettingNormal = ({
  settings,
  handleNumberProfile,
  onChangeNumberProfile,
  handleNumberLoop,
  onChangeNumberLoop,
  handleOnChangeTypeProfile,
  handleOnchangeUrl,
  handleOnChangeMuteaudio,
  handleOnChangeShowImage,
  ...rest
}) => {
  return (
    <div className="-normal-settings">
      <div className="-content-settings">
        <h2>RUNNING SETTINGS</h2>
        <div className="-sub-settings">
          <p>Numbers of profiles running simultaneously</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleNumberProfile('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleNumberProfile('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="numberProfile" value={settings.countProfile} onChange={onChangeNumberProfile}></input>
            </div>
            <div className="-input-sub-settings">
              <span>profile(s)</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Numbers of loops</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleNumberLoop('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleNumberLoop('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="numberLoop" value={settings.countLoop} onChange={onChangeNumberLoop}></input>
            </div>
            <div className="-input-sub-settings">
              <span>loop(s)</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Profile running type</p>
          <div className="-options-sub-settings">
            <Select
              id="typeProfile"
              className="-options-sub-settings__select -options-sub-settings__details"
              onChange={handleOnChangeTypeProfile}
              value={settings.runningType}
            >
              <MenuItem value="random">Random</MenuItem>
              <MenuItem value="topdown">Topdown</MenuItem>
            </Select>
          </div>
        </div>
        {/* <div className="-sub-settings">
          <p>URL</p>
          <div className="-options-sub-settings">
            <Select
              className="-options-sub-settings__select -options-sub-settings__details"
              onChange={handleOnchangeUrl}
              bordered={false}
              defaultValue={settings.URL}
              value={settings.URL}
              options={[
                {
                  value: 'https://mbasic.facebook.com',
                  label: 'https://mbasic.facebook.com',
                },
              ]}
            />
          </div>
        </div> */}
        <div className="-sub-settings -sub1-settings">
          <Switch checked={settings.muteAudio} onChange={handleOnChangeMuteaudio} />
          <p>Mute Audio</p>
        </div>
        <div className="-sub-settings -sub1-settings" style={{ marginTop: '10px' }}>
          <Switch checked={settings.showImage} onChange={handleOnChangeShowImage} />
          <p>Don’t show images</p>
        </div>
      </div>
    </div>
  );
};

export default SettingNormal;
