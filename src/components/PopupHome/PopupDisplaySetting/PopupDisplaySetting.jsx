import React, { useEffect, useState } from 'react';
import './style.scss';
import closePopup from '../../../assets/pictures/icon-x.svg';
import PopupComponent from '../PopupComponent/PopupComponent';

const PopupDisplaySetting = ({
  openDisplaySetting,
  handleCloseDisplaySetting,
  displaySettings,
  onSaveDisplaySettings,
}) => {
  const [settings, setSettings] = useState(displaySettings);
  useEffect(() => {
    setSettings(displaySettings);
  }, [openDisplaySetting]);
  return (
    <PopupComponent open={openDisplaySetting} onClose={handleCloseDisplaySetting}>
      {settings ? (
        <div className="layout-display-setting">
          <div className="layout-display-setting__top">
            <div className="layout-display-setting__top__title">
              <div className="layout-display-setting__top__title__close" onClick={handleCloseDisplaySetting}>
                <img src={closePopup} alt="icon-x"></img>
              </div>
              <p>DISPLAY SETTINGS</p>
            </div>
            <ul>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, uid: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.name}
                    type="checkbox"
                  ></input>
                </span>
                <p>User Name</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, password: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.password}
                    type="checkbox"
                  ></input>
                </span>
                <p>Password</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, status: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.status}
                    type="checkbox"
                  ></input>
                </span>
                <p>Status</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, follower: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.follower}
                    type="checkbox"
                  ></input>
                </span>
                <p>Follower/ Following</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, email: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.email}
                    type="checkbox"
                  ></input>
                </span>
                <p>Email</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, emailPass: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.emailPass}
                    type="checkbox"
                  ></input>
                </span>
                <p>Email's password</p>
              </li>

              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, proxy: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.proxy}
                    type="checkbox"
                  ></input>
                </span>
                <p>Proxy</p>
              </li>

              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, twoFA: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.twoFA}
                    type="checkbox"
                  ></input>
                </span>
                <p>2FA</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, tag: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.tag}
                    type="checkbox"
                  ></input>
                </span>
                <p>Tag</p>
              </li>
            </ul>
          </div>
          <div className="layout-display-setting__save">
            <button
              onClick={async () => {
                await onSaveDisplaySettings(settings);
                handleCloseDisplaySetting();
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
    </PopupComponent>
  );
};

export default PopupDisplaySetting;
