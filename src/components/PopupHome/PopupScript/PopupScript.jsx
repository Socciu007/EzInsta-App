import React, { useEffect, useState } from 'react';
import PopupComponent from '../PopupComponent/PopupComponent';
import closePopup from '../../../assets/pictures/icon-x.svg';
import settings from '../../../assets/pictures/icon-settings.png';
import search from '../../../assets/pictures/icon-search.svg';
import pin from '../../../assets/icon/icon-pin.svg';
import { Table, Tooltip } from 'antd';
import './style.scss';
import { storageScripts } from '../../../common/const.config';
import { runScript } from '../../../services/runScript';
import { dbGetLocally } from '../../../sender';
import PopupSetting from '../PopupSetting/PopupSetting';
import Dialog from '@mui/material/Dialog';
import { Store } from 'react-notifications-component';
import notification from '../../../resources/notification.json';
import { useDispatch } from 'react-redux';
const PopupScript = ({ openScripts, handleCloseScripts, profilesSelected }) => {
  const dispatch = useDispatch();
  const typeScript = [
    {
      title: 'All',
      value: 'all',
    },
    {
      title: `System's script`,
      value: 'system',
    },
    {
      title: 'Your script',
      value: 'your',
    },
  ];

  const [openSetting, setOpenSetting] = useState(false);
  const [type, setType] = useState('all');
  const [contentArray, setContentArray] = useState([]);
  const [scriptSelected, setScriptSelected] = useState();
  const [listScript, setListScript] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const handleNavigateSettings = () => {
    setOpenSetting(true);
  };
  const handleCloseSettings = () => {
    setOpenSetting(false);
  };

  useEffect(() => {
    setTimeout(() => {
      getScripts();
    }, 1000);
  }, []);

  useEffect(() => {
    if (!contentArray.length) return;
    let newList = [];
    if (listScript.length) {
      newList = contentArray.filter((e) => {
        const check = listScript.find((o) => o.id == e.id);
        if (check) return true;
        return false;
      });
    } else {
      newList = contentArray;
    }
    newList = newList.sort(function (a, b) {
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    newList = newList.sort((x, y) => Number(y.isPin) - Number(x.isPin));
    setListScript(newList);
  }, [contentArray]);

  const getScripts = async () => {
    const scriptStr = await dbGetLocally(storageScripts);
    if (scriptStr && scriptStr.length) {
      const script = JSON.parse(scriptStr);
      if (script && script.length) {
        setContentArray(script);
      }
    }
  };

  const handleTypeScript = (value) => {
    setType(value);
  };

  const runScriptAuto = async () => {
    if (!scriptSelected) {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Please choose script',
      });
      return;
    }
    handleCloseScripts();
    setSelectedRowKeys([]);
    setScriptSelected(null);
    await runScript(profilesSelected, scriptSelected, dispatch);
  };

  const searchScript = (text) => {
    let newScripts = [];
    if (text == '') {
      newScripts = contentArray;
    } else {
      newScripts = contentArray.filter((e) => {
        const note = e.note.toLowerCase();
        const name = e.name.toLowerCase();
        return note.includes(text.toLowerCase()) || name.includes(text.toLowerCase());
      });
    }
    newScripts = newScripts.sort(function (a, b) {
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    newScripts = newScripts.sort((x, y) => Number(y.isPin) - Number(x.isPin));
    setListScript(newScripts);
  };
  const generateNoteStr = (note, shot = true, length = 75) => {
    let noteStr = note && note.length ? `${note}` : '';

    if (noteStr.length > length && shot) {
      noteStr = `${note.slice(0, length)}...`;
    }
    return noteStr;
  };

  const columnsScripts = [
    {
      title: 'Scripts',
      width: 300,
      render: (script) => {
        return (
          <div className="pin">
            <Tooltip placement="topLeft" title={generateNoteStr(script.name, false)}>
              {generateNoteStr(script.name, true, 50)}
            </Tooltip>
            {script.isPin ? <img src={pin} alt="Pin" className={'show'} /> : null}
          </div>
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'note',
      width: 700,
      render: (note) => (
        <Tooltip placement="topLeft" title={generateNoteStr(note, false)}>
          {generateNoteStr(note)}
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      if (selectedRows.length) {
        setScriptSelected(selectedRows[0]);
      }
    },
  };
  const makeCopyChooseScript = {
    position: 'fixed',
    maxWidth: '100% !important',
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
  const MuiDialogPaperChooseScript = {
    width: '1163px',
    height: '679px',
    maxHeight: '679px !important',
    minWidth: '1163px !important',
    color: '#01162b !important',
  };
  const MuiDialogContainerChooseScript = {
    display: 'block',
  };
  return (
    <Dialog
      open={openScripts}
      onClose={() => {
        handleCloseScripts();
        setSelectedRowKeys([]);
        setScriptSelected(null);
      }}
      style={{ margin: 'auto' }}
      sx={{
        '& .MuiPaper-root': makeCopyChooseScript,
        '& .MuiBackdrop-root': overlay,
        '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': MuiDialogPaperChooseScript,
        '& .MuiDialog-container': MuiDialogContainerChooseScript,
      }}
    >
      <div className="-layout-choose-scripts">
        <div className="-layout-choose-scripts__container">
          <div className="-nav-scripts">
            <div className="-nav-scripts__header">
              <div
                className="-nav-scripts__header__close"
                onClick={() => {
                  handleCloseScripts();
                  setSelectedRowKeys([]);
                  setScriptSelected(null);
                }}
              >
                <img src={closePopup} alt="icon-x"></img>
              </div>
              <h1>CHOOSE SCRIPT</h1>
            </div>
            <div className="-wrapper-option-profiles -nav-scripts__btn">
              <span className="-option-profiles" onClick={handleNavigateSettings}>
                <img src={settings} alt="image-settings"></img>
              </span>
              <PopupSetting openSettings={openSetting} handleCloseSettings={handleCloseSettings}></PopupSetting>
              <div>
                <button
                  onClick={async () => {
                    await runScriptAuto();
                  }}
                >
                  Run
                </button>
              </div>
            </div>
          </div>
          <div className="-container-scripts">
            <div className="-container-scripts__left">
              <div className="-container-scripts__left__options">
                <div className="-container-scripts__left__options__type">
                  <ul className="-container-scripts__left__options__list">
                    {typeScript.map((script, index) => {
                      return (
                        <li
                          key={index}
                          className={`-option-item ${type == script.value && 'active'}`}
                          onClick={() => {
                            if (script.value !== type) {
                              setSelectedRowKeys([]);
                              setScriptSelected(null);
                              handleTypeScript(script.value);
                            }
                          }}
                        >
                          <div className="-option-item__row">
                            {/* {type == script.value ? (
                                <div className="li-dot" style={{ background: '#E84314' }}></div>
                              ) : null} */}

                            <p className="li-name">{script.title}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="-container-scripts__right">
              <div className="-container-scripts__right__main">
                <div className="-container-scripts__right__main__search">
                  <h1>SCRIPTS</h1>
                  <div className="-search-profiles">
                    <span>
                      <img src={search} alt="search" style={{ marginLeft: '11px' }}></img>
                    </span>
                    <input onChange={(event) => searchScript(event.target.value)} placeholder="Search..."></input>
                  </div>
                </div>

                <Table
                  rowSelection={{
                    ...rowSelection,
                    type: 'radio',
                  }}
                  rowClassName={(script) => (script.isPin ? 'pinned-row' : '')}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: () => {
                        const rowKeys = [];
                        rowKeys.push(rowIndex);
                        setSelectedRowKeys(rowKeys);
                        setScriptSelected(record);
                      },
                    };
                  }}
                  columns={columnsScripts}
                  dataSource={listScript
                    .map((e, index) => {
                      return { ...e, key: index };
                    })
                    .filter((e) => {
                      if (type == 'all') return true;
                      else if (type == 'system') {
                        return e.isSystem;
                      } else {
                        return !e.isSystem;
                      }
                    })}
                  pagination={false}
                ></Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PopupScript;
