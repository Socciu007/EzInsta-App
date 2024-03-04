// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { parseToNumber } from '../../../services/utils';
const Invite = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['inviteGroup']);
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }

      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n'), lineCount: textContent.split('\n').length });
    }
  }, [textContent]);

  const changeGroupFriendStart = (group) => {
    setValues({ ...values, groupFriendsStart: parseToNumber(group) });
  };

  const changeGroupFriendEnd = (group) => {
    setValues({ ...values, groupFriendsEnd: parseToNumber(group) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };

  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="invite">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleInvite">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Invite</p>
            </div>
            <div className="component-content__invite">
              <div className="component-item numberOfGroup_Friends">
                <p className="component-item__header">Number of friends/group:</p>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeGroupFriendStart(values.groupFriendsStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeGroupFriendStart(values.groupFriendsStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={values.groupFriendsStart}
                    onChange={(event) => changeGroupFriendStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeGroupFriendEnd(values.groupFriendsEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeGroupFriendEnd(values.groupFriendsEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={values.groupFriendsEnd}
                    onChange={(event) => changeGroupFriendEnd(event.target.value)}
                  />
                </div>
              </div>
              <div className="component-item delayTime">
                <p className="component-item__header">
                  Delay time<span style={{ marginLeft: '2px' }}>(s):</span>
                </p>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeDelayTimeStart(values.delayTimeStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeDelayTimeStart(values.delayTimeStart - 1);
                      }}
                    />
                  </div>
                  <input
                    name="Start"
                    type="text"
                    value={values.delayTimeStart}
                    onChange={(event) => changeDelayTimeStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeDelayTimeEnd(values.delayTimeEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeDelayTimeEnd(values.delayTimeEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    name="End"
                    type="text"
                    value={values.delayTimeEnd}
                    onChange={(event) => changeDelayTimeEnd(event.target.value)}
                  />
                </div>
              </div>
              <div className="component-item__header">
                <p>Select Invite type</p>
              </div>
              <div className="InviteContent">
                <div className="component-item InviteOption">
                  <Select
                    name="InviteOption"
                    className="InviteType"
                    onChange={(event) => {
                      changeOption(event.target.value);
                    }}
                    value={values.option}
                  >
                    {/* <MenuItem value="random">Random</MenuItem> */}
                    <MenuItem value="suggestions">By suggestions</MenuItem>
                  </Select>
                </div>
                {(values.option === 'suggestions' || values.option === 'random') && (
                  <div>
                    <div className="UIDContent">
                      <div className="UID_Header">
                        <p>Group UID list</p>
                        <span>({values.lineCount})</span>
                      </div>
                      <div className="component-item " style={{ position: 'relative' }}>
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                          <Editor
                            value={textContent}
                            onValueChange={(text) => setTextContent(text)}
                            highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                            padding={15}
                            className="editor"
                            textareaId="codeArea"
                            style={{
                              background: '#f5f5f5',
                              fontSize: 15,
                            }}
                          />
                        </div>
                        <div onClick={handleDivClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                          <p>
                            <span>1</span>Enter the UID here
                          </p>
                          <p>
                            <span>2</span>Each UID/line
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invite;
