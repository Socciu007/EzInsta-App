import React, { useEffect, useState } from 'react';
import './style.scss';
import closePopup from '../../../assets/pictures/icon-x.svg';
// import PopupComponent from '../../PopupComponent/PopupComponent';
import PopupComponent from '../../PopupHome/PopupComponent/PopupComponent';

const PopupDisplaySettingScript = ({
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
              {/* <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, profile: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.profile}
                    type="checkbox"
                  ></input>
                </span>
                <p>Profile</p>
              </li> */}
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, name: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.name}
                    type="checkbox"
                  ></input>
                </span>
                <p>Name</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, note: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.note}
                    type="checkbox"
                  ></input>
                </span>
                <p>Note</p>
              </li>
              <li>
                <span>
                  <input
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const newSettings = { ...settings, created: checked };
                      setSettings(newSettings);
                    }}
                    checked={settings.created}
                    type="checkbox"
                  ></input>
                </span>
                <p>Created</p>
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

export default PopupDisplaySettingScript;
