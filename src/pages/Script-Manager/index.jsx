import React, { useEffect, useState, useRef } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Dialog from '@mui/material/Dialog';
import back from '../../assets/icon/icon-back.svg';
import pin from '../../assets/icon/icon-pin.svg';
import pinBlack from '../../assets/icon/icon-pinBlack.svg';
import iconEdit from '../../assets/icon/icon-editBlack.svg';
import iconDuplicate from '../../assets/icon/icon-duplicate.svg';
import iconDelete from '../../assets/icon/icon-Delete.svg';
import option from '../../assets/icon/icon-options.svg';
import close from '../../assets/icon/icon-close.svg';
import yourScript from '../../assets/pictures/icon-yourScripts.svg';
import yourScriptBlue from '../../assets/icon/icon-yourScriptsBlue.svg';
import plus from '../../assets/pictures/icon-plus.png';
import iconCheck from '../../assets/icon/icon-checkBlue.svg';
import systemScript from '../../assets/icon/icon-systemScript.svg';
import running from '../../assets/icon/icon-running.svg';
import { storageScripts } from '../../common/const.config';
import { v4 as uuidv4 } from 'uuid';
import { dbGetLocally, dbSetLocally } from '../../sender';
import { Input, Table, Tooltip } from 'antd';
import { formatTimeDay } from '../../services/utils';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
import { useSelector, useDispatch } from 'react-redux';
import { setScriptAuto } from '../../redux/scriptAutoSlice';
import PopupRunScript from '../../components/PopupHome/PopupRunScript/PopupRunScript';
import { EditableCell, EditableRow } from '../../components/EditableTable/EditableTable';
const ScriptManager = () => {
  const navigate = useNavigate();

  // for style menu materials UI
  const menuStyle = {
    marginTop: '-15px',
    marginLeft: '-8px',
    boxShadow:
      '0px 5px 5px -3px rgb(233 232 232 / 20%), 0px 8px 10px 1px rgb(255 255 255 / 14%), 0px 3px 14px 2px rgb(241 232 232 / 12%)',
  };
  const liStyle = {
    fontFamily: 'GOOGLESANS',
  };
  const makeCopy = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '15px',
    background: '#fff',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    width: '636px',
    maxWidth: '636px',
    flexShrink: '0',
    padding: '25px',
    zIndex: '99999',
    margin: '0',
  };
  const dialog_delete = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '15px',
    background: '#fff',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    width: '636px',
    maxWidth: '636px',
    flexShrink: '0',
    margin: '0',
    padding: '25px 25px 35px 25px',
  };

  const overlay = {
    background: 'rgba(255,255,255,0.9)',
  };
  const [isSystem, setIsSystem] = useState(false);
  const [contentArray, setContentArray] = useState([]);
  const [listScript, setListScript] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemSelect, setItemSelect] = useState(null);
  const [nameCoppy, setNameCoppy] = useState('');
  const [isRunScript, setIsRunScript] = useState(false);
  const profiles = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  useEffect(() => {
    getScripts();
  }, []);

  useEffect(() => {
    setListScript(mapStatus(listScript));
  }, [profiles]);

  // useEffect(() => {
  //   if (contentArray && contentArray.length) {
  //     setListScript();
  //   }
  // }, [contentArray]);

  const mapStatus = (newList) => {
    if (!profiles || profiles.length == 0) return newList;
    const newArr = [...newList];
    newList.forEach((e, index) => {
      const total = profiles.filter((o) => o.script == e.id);
      const scriptDone = profiles.filter((o) => o.script == e.id && o.status == 'ready');

      newArr[index] = {
        ...newArr[index],
        status: total.length > 0 ? { done: scriptDone.length, total: total.length } : null,
      };
    });
    return newArr;
  };
  useEffect(() => {
    if (!contentArray.length) return;
    reloadListScript();
  }, [contentArray]);

  const reloadListScript = () => {
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
    newList = mapStatus(newList);
    newList = newList.sort(function (a, b) {
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    newList = newList.sort((x, y) => Number(y.isPin) - Number(x.isPin));
    newList = mapStatus(newList);
    setListScript(newList);
  };
  let item;
  useEffect(() => {
    if (!itemSelect) return;
    item = listScript.find((e) => e.id == itemSelect.id);
    if (!item) setItemSelect(null);
  }, [listScript]);

  const getScripts = async () => {
    const scriptStr = await dbGetLocally(storageScripts);
    if (scriptStr && scriptStr.length) {
      const script = JSON.parse(scriptStr);
      if (script && script.length) {
        setContentArray(script);
      }
    }
  };

  // Handle the button add
  const handleAddClick = () => {
    navigate('/create');
  };
  // Handle the button back
  const handleBackClick = () => {
    navigate('/');
  };
  // Handle the button edit
  const handleEditClick = () => {
    navigate('/create', {
      state: { ...itemSelect, status: '' },
    });
  };
  // Handle category button
  const handleButtonClick = (isSystem) => {
    let newList = contentArray.filter((e) => {
      if (!e.isSystem && isSystem) return true;
      return false;
    });
    newList = newList.sort(function (a, b) {
      if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    newList = newList.sort((x, y) => Number(y.isPin) - Number(x.isPin));
    setIsSystem(!isSystem);
    setListScript(newList);
  };

  const [makeCopyDialogOpen, setMakeCopyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const coppyScript = async (id, name) => {
    const script = contentArray.find((e) => e.id == id);
    if (script) {
      const newList = [...contentArray];
      const newListScript = [...listScript];
      const newItem = { ...script, name, id: uuidv4(), isPin: false, status: '' };
      newListScript.push(newItem);
      setListScript(newListScript);
      newList.push(newItem);
      setContentArray(newList);
      await dbSetLocally(storageScripts, JSON.stringify(newList));
    }
  };

  const deleteScript = async (id) => {
    const newList = contentArray.filter((e) => e.id !== id);
    const newListScript = listScript.filter((e) => e.id !== id);
    setListScript(newListScript);
    setContentArray(newList);
    await dbSetLocally(storageScripts, JSON.stringify(newList));
  };

  const handleCloseDialog = (className) => {
    if (className === 'makeCopy') {
      setMakeCopyDialogOpen(false);
    } else if (className === 'delete') {
      setDeleteDialogOpen(false);
    }
  };

  const handleOptionClick = (className, script) => {
    if (className === 'makeCopy') {
      setMakeCopyDialogOpen(true);
    } else if (className === 'delete') {
      setDeleteDialogOpen(true);
    }
    setItemSelect(script);
    handleClose();
  };

  const handleTogglePin = async (scriptId) => {
    const index = listScripts.findIndex((e) => e.id == scriptId);
    if (index >= 0) {
      const newArr = listScripts;
      newArr[index].isPin = !newArr[index].isPin;
      setContentArray(newArr);
      setListScript(newArr);
      newArr[index].status = '';
      await dbSetLocally(storageScripts, JSON.stringify(newArr));
    }
    setItemSelect(null);
    handleClose();
  };

  // Handle toggle menu

  const handleClick = (event, script) => {
    setAnchorEl(event.currentTarget);
    setItemSelect(script);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const generateNoteStr = (note, shot = true, length = 75) => {
    let noteStr = note && note.length ? `${note}` : '';

    if (noteStr.length > length && shot) {
      noteStr = `${note.slice(0, length)}...`;
    }
    return noteStr;
  };

  const listScripts = listScript.map((item, index) => {
    return { ...item, index, key: index };
  });

  const handleSaveTag = async (row) => {
    if (row && row.tag && row.tag.length) {
      const newScript = [...listScripts];
      const index = newScript.findIndex((script) => row.id === script.id);
      const script = newScript[index];
      script.tag = row.tag
        .toString()
        .split(',')
        .map((e) => {
          if (e && e.length && !e.startsWith('#')) {
            return '#' + e.toString().trim();
          }
          return e;
        });
      newScript.splice(index, 1, {
        ...script,
      });
      setContentArray(newScript);
      setListScript(newScript);
      newScript[index].status = '';
      await dbSetLocally(storageScripts, JSON.stringify(newScript));
    }
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = [
    {
      title: '#',
      width: 30,
      render: (text, record, index) => <div className="stt">{index + 1}</div>,
    },
    {
      title: 'Name',
      width: 230,
      render: (script) => (
        <div className="pin">
          <Tooltip placement="topLeft" title={generateNoteStr(script.name, false)}>
            {generateNoteStr(script.name, true, 50)}
          </Tooltip>
          {script.isPin ? <img src={pin} alt="Pin" className={'show'} /> : null}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) => {
        if (!a.isPin && !b.isPin) {
          const nameA = a.status ? a.status.toString().toUpperCase() : '';
          const nameB = b.status ? b.status.toString().toUpperCase() : '';
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        }
      },
      width: 180,
      render: (status, script) => {
        return (
          <>
            <div
              onClick={() => {
                dispatch(setScriptAuto(script.name));
                setItemSelect(script);
                setIsRunScript(true);
                setAnchorEl(null);
              }}
            >
              {status && status.total ? (
                <div className="statusRunning">
                  <img src={running} alt="run profile icon" />
                  <span>
                    <span className="profileRunning">{status.done}</span>
                    <span className="totalProfile">
                      {' '}
                      / {status.total} {status.total == 1 ? 'profile' : 'profiles'}
                    </span>
                  </span>
                </div>
              ) : null}
            </div>
            <PopupRunScript
              script={script.id}
              openRunScript={itemSelect && itemSelect.id === script.id && isRunScript}
              handleCloseRunScript={() => setIsRunScript(false)}
            ></PopupRunScript>
          </>
        );
      },
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      editable: true,
      render: (tag) => {
        return <Input name="tag" value={tag} className="-tag-script" onChange={(e) => e.target.value}></Input>;
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
      width: 150,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 300,
      render: (note) => (
        <Tooltip placement="topLeft" title={generateNoteStr(note, false)}>
          {generateNoteStr(note)}
        </Tooltip>
      ),
    },
    {
      title: 'Created',
      render: (script) => {
        return (
          <div className="pin">
            <span>{script.createdAt ? formatTimeDay(script.createdAt) : ''}</span>
          </div>
        );
      },
      width: 100,
    },
    {
      width: 30,
      fixed: 'right',
      render: (script) => {
        return (
          <div>
            <div className="-expand-icon">
              {/* <p className="runScript">Run</p> */}
              {/* <p className="stopScript">Stop</p> */}
              <img
                src={option}
                alt="image-option"
                id={`basic-menu-${script.id}`}
                onClick={(event) => {
                  handleClick(event, script);
                }}
                // aria-expanded={open ? 'true' : 'false'}
                // aria-controls={open ? `basic-menu-${script.id}` : undefined}
                aria-haspopup="true"
              ></img>
              <div className={itemSelect && itemSelect.id === script.id ? 'script selected' : 'script'}>
                <Menu
                  anchorEl={anchorEl}
                  id={`basic-menu-${script.id}`}
                  open={itemSelect && itemSelect.id === script.id && anchorEl ? true : false}
                  onClose={() => {
                    setItemSelect(null);
                  }}
                  className="MenuScript"
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                  sx={{
                    '& .MuiPaper-root': menuStyle,
                    '& .MuiButtonBase-root': liStyle,
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <div className="d-flex MuiBox-root css-0">
                    <div className="dropList">
                      <ul>
                        <li id={script.id} onClick={() => handleTogglePin(script.id)}>
                          <img src={pinBlack} alt="icon pin" />
                          {!script.isPin ? <p>Pin</p> : <p>Unpin</p>}
                        </li>
                        <li onClick={handleEditClick}>
                          <img src={iconEdit} alt="icon edit" />
                          Edit
                        </li>
                        <li onClick={() => handleOptionClick('makeCopy', script)}>
                          <img src={iconDuplicate} alt="icon duplicate" />
                          Duplicate
                        </li>
                        <li onClick={() => handleOptionClick('delete', script)}>
                          <img src={iconDelete} alt="icon delete" />
                          Delete
                        </li>
                      </ul>
                    </div>
                    <div style={{ width: '60px', background: 'tranparent !important', display: 'inherit' }}></div>
                  </div>
                </Menu>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const newColumns = columns.map((col) => {
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

  return (
    <>
      <div
        className="wrapper"
        style={{
          opacity: isRunScript ? 0.1 : 1,
        }}
      >
        <div className="script-manager">
          <div className="script-manager__header">
            <h1>FACEBOOK AUTOMATION</h1>
            <div className="title">
              <button>
                <img src={back} alt="" onClick={handleBackClick} />
              </button>
              <p>Script Manager</p>
            </div>
            <div className="-nav-bar">
              <div className="scriptManager">
                <img src={yourScript} alt="script manager(your script black) icon" />
                <p>SCRIPT MANAGER</p>
              </div>
              <div className="-nav-bar__right">
                <div className="createScript" onClick={handleAddClick}>
                  <span>
                    <img src={plus} alt="plus icon" />
                  </span>
                  <p>Create a new script</p>
                </div>
                <div
                  className={!isSystem ? 'yourScript active' : 'yourScript'}
                  onClick={() => {
                    handleButtonClick(true);
                  }}
                >
                  <img src={yourScriptBlue} alt="icon your script blue" />
                  <p>Your Scripts</p>
                  {!isSystem ? <img src={iconCheck} alt="icon check" /> : ''}
                </div>
                <div
                  className={!isSystem ? 'systemScript ' : 'systemScript active'}
                  onClick={() => {
                    handleButtonClick(false);
                  }}
                >
                  <img src={systemScript} alt="icon system scripts" />
                  <p>System’s Scripts</p>
                  {isSystem ? <img src={iconCheck} alt="icon check" /> : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="script-manager__content">
            <Table
              columns={newColumns}
              components={components}
              showSorterTooltip={false}
              pagination={false}
              dataSource={listScripts}
              rowClassName={(profile) => (profile.isPin ? 'pinned-row' : '')}
            />
          </div>
          <Dialog
            sx={{
              '& .MuiPaper-root': makeCopy,
              '& .MuiBackdrop-root': overlay,
            }}
            open={makeCopyDialogOpen}
            onPlay={() => setNameCoppy('')}
            onClose={() => handleCloseDialog('makeCopy')}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <div className="makeCopy">
              <div className="makeCopy__top">
                <p>MAKE A COPY</p>
                <button className="close" onClick={() => handleCloseDialog('makeCopy')}>
                  <img src={close} alt="Close" />
                </button>
              </div>
              <div className="makeCopy__bottom">
                <input
                  onChange={(event) => setNameCoppy(event.target.value)}
                  type="text"
                  placeholder="Enter name here..."
                />
                <button
                  onClick={async () => {
                    if (nameCoppy == '') {
                      Store.addNotification({
                        ...notification,
                        type: 'warning',
                        message: 'Enter name script',
                      });
                    } else {
                      console.log(itemSelect);
                      coppyScript(itemSelect.id, nameCoppy);
                      handleCloseDialog('makeCopy');
                      Store.addNotification({
                        ...notification,
                        type: 'success',
                        message: 'Coppy script success',
                      });
                    }
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </Dialog>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => handleCloseDialog('delete')}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            sx={{
              '& .MuiPaper-root': dialog_delete,
              '& .MuiBackdrop-root': overlay,
            }}
          >
            <div className="dialog_delete">
              <h1>DELETE</h1>
              <p>Are you sure to delete this script?</p>
              <div>
                <button onClick={() => handleCloseDialog('delete')}>Cancel</button>
                <button
                  onClick={() => {
                    console.log(itemSelect);
                    deleteScript(itemSelect.id);
                    handleCloseDialog('delete');
                    Store.addNotification({
                      ...notification,
                      type: 'success',
                      message: 'Delete script success',
                    });
                  }}
                  className="deleteBtn"
                >
                  Delete
                </button>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default ScriptManager;
