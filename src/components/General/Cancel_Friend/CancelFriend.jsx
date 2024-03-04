import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { parseToNumber } from '../../../services/utils';
const CancelFriend = ({ onGoBackClick, updateDesignScript, id, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['cancelFriend']);
  const [UIDContent, setUIDContent] = useState('');
  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.UID && currentSetup.UID.length) {
        setUIDContent(currentSetup.UID.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (UIDContent.length) {
      setValues({ ...values, UID: UIDContent.split('\n') });
    }
  }, [UIDContent]);
  const changeFriendStart = (friend) => {
    setValues({ ...values, numberFriendStart: parseToNumber(friend) });
  };

  const changeFriendEnd = (friend) => {
    setValues({ ...values, numberFriendEnd: parseToNumber(friend) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const changeRequestStart = (request) => {
    setValues({ ...values, requestsStart: parseToNumber(request) });
  };
  const changeRequestEnd = (request) => {
    setValues({ ...values, requestsEnd: parseToNumber(request) });
  };

  const changeOption = (value) => {
    setValues({ ...values, optionCancelFriend: value });
  };

  const changeOptionUnfriend = (value) => {
    setValues({ ...values, optionUnfriend: value });
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
    <div className="CancelFriend">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleCancelFriend">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Cancel friend</p>
            </div>
            <div className="component-item cancelFriend">
              <div className="component-item__header">
                <p>Select Cancel friend type</p>
              </div>
              <div className="cancelFriendContent">
                <div className="component-item cancelFriendOption">
                  <Select
                    name="cancelFriendOption"
                    className="cancelFriendType"
                    onChange={(event) => {
                      changeOption(event.target.value);
                    }}
                    value={values.optionCancelFriend}
                  >
                    <MenuItem value="cancelRequest">Cancel friend requests</MenuItem>
                    <MenuItem value="unfriend">Unfriend</MenuItem>
                  </Select>
                </div>
                {values.optionCancelFriend === 'cancelRequest' && (
                  <div className="component-item numberOfRequests">
                    <p className="component-item__header">Number of requests:</p>
                    <div className="component-item__number">
                      <div className="component-item__number__icon">
                        <img
                          src={iconIncrease}
                          alt="Increase icon"
                          onClick={() => {
                            changeRequestStart(values.requestsStart + 1);
                          }}
                        />
                        <img
                          src={iconDecrease}
                          alt="Decrease icon"
                          onClick={() => {
                            changeRequestStart(values.requestsStart - 1);
                          }}
                        />
                      </div>
                      <input
                        name="Start"
                        type="text"
                        value={values.requestsStart}
                        onChange={(event) => changeRequestStart(event.target.value)}
                      />
                    </div>
                    <span>to</span>
                    <div className="component-item__number">
                      <div className="component-item__number__icon">
                        <img
                          src={iconIncrease}
                          alt="Increase icon"
                          onClick={() => {
                            changeRequestEnd(values.requestsEnd + 1);
                          }}
                        />
                        <img
                          src={iconDecrease}
                          alt="Decrease icon"
                          onClick={() => {
                            changeRequestEnd(values.requestsEnd - 1);
                          }}
                        />
                      </div>
                      <input
                        name="End"
                        type="text"
                        value={values.requestsEnd}
                        onChange={(event) => changeRequestEnd(event.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                {values.optionCancelFriend === 'unfriend' && (
                  <div className="component-item unfriend">
                    <div className="component-item__header">
                      <p>Unfriend options</p>
                    </div>
                    <div className="unfriendContent">
                      <div className="component-item unfriendOption">
                        <Select
                          name="unfriendOption"
                          className="unfriendSelector"
                          onChange={(event) => {
                            changeOptionUnfriend(event.target.value);
                          }}
                          value={values.optionUnfriend}
                        >
                          <MenuItem value="random">Random</MenuItem>
                          <MenuItem value="UID">UID</MenuItem>
                        </Select>
                      </div>
                      {values.optionUnfriend === 'random' && (
                        <div className="component-item comment__numberFriend">
                          <p className="component-item__header">Number of friends:</p>
                          <div className="component-item__content">
                            <div className="component-item__number">
                              <div className="component-item__number__icon">
                                <img
                                  src={iconIncrease}
                                  alt="Increase icon"
                                  onClick={() => {
                                    changeFriendStart(values.numberFriendStart + 1);
                                  }}
                                />
                                <img
                                  src={iconDecrease}
                                  alt="Decrease icon"
                                  onClick={() => {
                                    changeFriendStart(values.numberFriendStart - 1);
                                  }}
                                />
                              </div>
                              <input
                                name="Start"
                                type="text"
                                value={values.numberFriendStart}
                                onChange={(event) => changeFriendStart(event.target.value)}
                              />
                            </div>
                            <span>to</span>
                            <div className="component-item__number">
                              <div className="component-item__number__icon">
                                <img
                                  src={iconIncrease}
                                  alt="Increase icon"
                                  onClick={() => {
                                    changeFriendEnd(values.numberFriendEnd + 1);
                                  }}
                                />
                                <img
                                  src={iconDecrease}
                                  alt="Decrease icon"
                                  onClick={() => {
                                    changeFriendEnd(values.numberFriendEnd - 1);
                                  }}
                                />
                              </div>
                              <input
                                name="End"
                                type="text"
                                value={values.numberFriendEnd}
                                onChange={(event) => changeFriendEnd(event.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {values.optionUnfriend === 'UID' && (
                        <div className="component-item" style={{ position: 'relative' }}>
                          <div className="UIDText" style={{ width: '100%', height: 204, overflow: 'auto' }}>
                            <Editor
                              value={UIDContent}
                              onValueChange={(UIDContent) => setUIDContent(UIDContent)}
                              highlight={(text) => hightlightWithLineNumbers(text, languages.js, UIDContent)}
                              padding={15}
                              className="editor"
                              textareaId="codeArea"
                              style={{
                                background: '#f5f5f5',
                                fontSize: 15,
                              }}
                            />
                          </div>
                          <div onClick={handleDivClick} className={`placeholder ${UIDContent ? 'hide' : ''}`}>
                            <p>
                              <span>1</span>Enter the UID list here
                            </p>
                            <p>
                              <span>2</span>Each UID/line
                            </p>
                          </div>
                        </div>
                      )}
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

export default CancelFriend;
