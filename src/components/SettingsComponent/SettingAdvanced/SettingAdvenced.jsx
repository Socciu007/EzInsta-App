import React from 'react';
import './style.scss';
import up from '../../../assets/pictures/icon-Increase.svg';
import down from '../../../assets/pictures/icon-Descrease.svg';

const SettingAdvenced = ({
  settings,
  handleDelayInEachNewThread,
  handleMaxTimePerThread,
  handleStopIfCPUReaches,
  handleStopIfDiskReaches,
  handlestopIfRamReaches,
  onChangeDelayInEachNewThread,
  onChangeMaxTimePerThread,
  onChangeStopIfCPUReaches,
  onChangeStopIfDiskReaches,
  onChangeStopIfRamReaches,
  ...rest
}) => {
  return (
    <div className="-normal-settings -advanced-settings">
      <div className="-content-settings">
        <h2>ADVANCED SETTINGS</h2>
        <div className="-sub-settings">
          <p>Maximum time per thread</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleMaxTimePerThread('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleMaxTimePerThread('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="maxTimePerThread" value={settings.maxTime} onChange={onChangeMaxTimePerThread}></input>
            </div>
            <div className="-input-sub-settings">
              <span>seconds</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Delay in each new thread open</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleDelayInEachNewThread('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleDelayInEachNewThread('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input
                name="delayInEachNewThread"
                value={settings.delayThread}
                onChange={onChangeDelayInEachNewThread}
              ></input>
            </div>
            <div className="-input-sub-settings">
              <span>seconds</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Stop if RAM reaches</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handlestopIfRamReaches('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handlestopIfRamReaches('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="stopIfRamReaches" value={settings.maxRam} onChange={onChangeStopIfRamReaches}></input>
            </div>
            <div className="-input-sub-settings">
              <span>%</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Stop if CPU reaches</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleStopIfCPUReaches('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleStopIfCPUReaches('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="stopIfCPUReaches" value={settings.maxCpu} onChange={onChangeStopIfCPUReaches}></input>
            </div>
            <div className="-input-sub-settings">
              <span>%</span>
            </div>
          </div>
        </div>
        <div className="-sub-settings">
          <p>Stop if DISK reaches</p>
          <div className="-options-sub-settings">
            <div className="-count-settings">
              <div className="Icon-Upn_Down">
                <div style={{ marginBottom: '2px' }} onClick={() => handleStopIfDiskReaches('increase')}>
                  <img src={up} alt="up" width={10} height={7} />
                </div>
                <div style={{ marginTop: '2px' }} onClick={() => handleStopIfDiskReaches('descrease')}>
                  <img src={down} alt="down" width={10} height={7} />
                </div>
              </div>
              <input name="stopIfDiskReaches" value={settings.maxDisk} onChange={onChangeStopIfDiskReaches}></input>
            </div>
            <div className="-input-sub-settings">
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingAdvenced;
