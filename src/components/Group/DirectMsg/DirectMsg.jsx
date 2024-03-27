// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { parseToNumber } from '../../../services/utils';
import { Select } from 'antd';
const DirectMsg = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['directMsg']);
  const [userContent, setUserContent] = useState('');
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.userList && currentSetup.userList.length) {
        setUserContent(currentSetup.userList.join('\n'));
      }
      if (currentSetup.messageList && currentSetup.messageList.length) {
        setMessageContent(currentSetup.messageList.join('\n'));
      }
      setTimeout(() => {
        setValues(currentSetup);
      }, 20);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (userContent.length) {
      setValues({ ...values, userList: userContent.split('\n') });
    } else {
      setValues({ ...values, userList: [] });
    }
  }, [userContent]);

  useEffect(() => {
    if (messageContent.length) {
      setValues({ ...values, messageList: messageContent.split('\n') });
    } else {
      setValues({ ...values, messageList: [] });
    }
  }, [messageContent]);

  const changeTypeDirectMsg = (value) => {
    setValues({ ...values, typeDirectMSg: value });
  };
  const changeType = (value) => {
    setValues({ ...values, typeNew: value });
  };

  const changeNumberStart = (value) => {
    setValues({ ...values, numberStart: parseToNumber(value) });
  };
  const changeNumberEnd = (value) => {
    setValues({ ...values, numberEnd: parseToNumber(value) });
  };

  const handleDivUserListClick = () => {
    document.getElementById('userList').focus();
  };

  const handleDivMsgListClick = () => {
    document.getElementById('msgList').focus();
  };

  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="DirectMsg">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleDirectMsg">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Direct message</p>
            </div>
            {/* <div className="component-content__DirectMsg"> */}
            <div className="component-item -type-direct">
              <p>Direct message by:</p>
              <div className="PostContent">
                <Select
                  id="typeProfile"
                  className="PostContent__select PostContent__details"
                  value={values.typeDirectMSg}
                  onChange={changeTypeDirectMsg}
                  bordered={false}
                  options={[
                    {
                      value: 'user',
                      label: 'User',
                    },
                    {
                      value: 'follower',
                      label: 'Follower',
                    },
                    {
                      value: 'following',
                      label: 'Following',
                    },
                  ]}
                />
              </div>
            </div>
            <div className="component-item delayTime">
              <p className="component-item__header">Quantity:</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeNumberStart(values.numberStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeNumberStart(values.numberStart - 1);
                    }}
                  />
                </div>
                <input
                  name="Start"
                  type="text"
                  value={values.numberStart}
                  onChange={(event) => changeNumberStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeNumberEnd(values.numberEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeNumberEnd(values.numberEnd - 1);
                    }}
                  />
                </div>
                <input
                  name="End"
                  type="text"
                  value={values.numberEnd}
                  onChange={(event) => changeNumberEnd(event.target.value)}
                />
              </div>
            </div>
            {(values.typeDirectMSg === 'follower' || values.typeDirectMSg === 'following') && (
              <div className="component-item -type-direct">
                <p>Type</p>
                <div className="PostContent">
                  <Select
                    id="typeProfile"
                    className="PostContent__select PostContent__details"
                    value={values.typeNew}
                    onChange={changeType}
                    bordered={false}
                    options={[
                      {
                        value: 'user',
                        label: 'User',
                      },
                      {
                        value: 'random',
                        label: 'Random',
                      },
                    ]}
                  />
                </div>
              </div>
            )}

            {(values.typeNew === 'user' || values.typeDirectMSg === 'user') && (
              <div className="component-item userList">
                <div className="KeywordContent">
                  <div className="Keyword_Header">
                    <p>User list</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="userText">
                  <Editor
                    value={userContent}
                    onValueChange={(text) => {
                      setUserContent(text);
                    }}
                    highlight={(text) => hightlightWithLineNumbers(text, languages.js, userContent)}
                    padding={15}
                    className="editor"
                    textareaId="userList"
                    style={{
                      background: '#f5f5f5',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div onClick={handleDivUserListClick} className={`placeholder ${userContent ? 'hide' : ''}`}>
                  <p>
                    <span>1</span>Enter the content here
                  </p>
                  <p>
                    <span>2</span>Each content/line
                  </p>
                </div>
              </div>
            )}

            <div className="component-item userList" style={{ position: 'relative' }}>
              <div className="KeywordContent">
                <div className="Keyword_Header">
                  <p>Message</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="userText">
                <Editor
                  value={messageContent}
                  onValueChange={(text) => {
                    setMessageContent(text);
                  }}
                  highlight={(text) => hightlightWithLineNumbers(text, languages.js, messageContent)}
                  padding={15}
                  className="editor"
                  textareaId="msgList"
                  style={{
                    background: '#f5f5f5',
                    fontSize: 15,
                  }}
                />
              </div>
              <div onClick={handleDivMsgListClick} className={`placeholder ${messageContent ? 'hide' : ''}`}>
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
  );
};

export default DirectMsg;
