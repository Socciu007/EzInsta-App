// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useRef } from 'react';
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
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const Send_Message = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['sendMsg']);
  const [textContent, setTextContent] = useState('');
  const [UIDContent, setUIDContent] = useState('');

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }
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
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n') });
    }
  }, [textContent]);
  useEffect(() => {
    if (UIDContent.length) {
      setValues({ ...values, UID: UIDContent.split('\n') });
    }
  }, [UIDContent]);

  const changePostStart = (post) => {
    setValues({ ...values, postStart: parseToNumber(post) });
  };

  const changePostEnd = (post) => {
    setValues({ ...values, postEnd: parseToNumber(post) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const handleUIDDivUIDClick = () => {
    document.getElementById('UID').focus();
  };

  const handleMessagesDivClick = () => {
    document.getElementById('message').focus();
  };

  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');
  return (
    <div className="sendMessage">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Send message</p>
            </div>
            <div className="component-item numberOfPost">
              <p className="component-item__header">Number of posts:</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changePostStart(values.postStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changePostStart(values.postStart - 1);
                    }}
                  />
                </div>
                <input
                  name="Start"
                  type="text"
                  value={values.postStart}
                  onChange={(event) => changePostStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changePostEnd(values.postEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changePostEnd(values.postEnd - 1);
                    }}
                  />
                </div>
                <input
                  name="End"
                  type="text"
                  value={values.postEnd}
                  onChange={(event) => changePostEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item delayTime">
              <p className="component-item__header">
                Delay time<span style={{ marginLeft: '2px' }}> (s):</span>
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
            <div className="component-item Post">
              <div className="component-item__header">
                <p>Post options</p>
              </div>
              <div className="PostContent">
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeOption(event.target.value)}
                    value={values.option}
                  >
                    <MenuItem value="randomFriend">Randomly choose friends</MenuItem>
                    <MenuItem value="specificFriend">Specific friends</MenuItem>
                  </Select>
                </div>

                {values.option === 'specificFriend' && (
                  <div className="Messages">
                    <div className="component-item " style={{ position: 'relative', marginTop: '0' }}>
                      <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                        <Editor
                          value={UIDContent}
                          onValueChange={(UID) => {
                            setUIDContent(UID);
                          }}
                          highlight={(text) => hightlightWithLineNumbers(text, languages.js, UIDContent)}
                          padding={15}
                          className="editor"
                          textareaId="UID"
                          style={{
                            background: '#f5f5f5',
                            fontSize: 15,
                          }}
                        />
                      </div>
                      <div onClick={handleUIDDivUIDClick} className={`placeholder ${UIDContent ? 'hide' : ''}`}>
                        <p>
                          <span>1</span>Enter the UID here
                        </p>
                        <p>
                          <span>2</span>Each UID/line
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <p className="selectPost__header">Messages</p>
                <div className="component-item " style={{ position: 'relative', marginTop: '0' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="messages">
                    <Editor
                      value={textContent}
                      onValueChange={(text) => {
                        setTextContent(text);
                      }}
                      highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                      padding={15}
                      className="editor"
                      textareaId="message"
                      style={{
                        background: '#f5f5f5',
                        fontSize: 15,
                      }}
                    />
                  </div>

                  <div onClick={handleMessagesDivClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                    <p>
                      <span>1</span>Enter the content here
                    </p>
                    <p>
                      <span>2</span>Each content/line
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send_Message;
