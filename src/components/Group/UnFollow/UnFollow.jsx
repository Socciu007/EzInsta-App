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
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { parseToNumber } from '../../../services/utils';
import { Select } from 'antd';
const UnFollow = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['unfollow']);
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.userList && currentSetup.userList.length) {
        setTextContent(currentSetup.userList.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, userList: textContent.split('\n') });
    } else {
      setValues({ ...values, userList: [] });
    }
  }, [textContent]);

  const changeNumberStart = (value) => {
    setValues({ ...values, numberStart: parseToNumber(value) });
  };

  const changeNumberEnd = (value) => {
    setValues({ ...values, numberEnd: parseToNumber(value) });
  };

  const changeTypeUnfollow = (value) => {
    setValues({ ...values, typeUnfollow: value });
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
              <p>Unfollow</p>
            </div>
            <div className="component-content__invite">
              {/* <div className="component-item__header">
                <p>Select Invite type</p>
              </div> */}
              <div className="component-item -type-unfollower">
                <div className="PostContent">
                  <Select
                    id="typeProfile"
                    className="PostContent__select PostContent__details"
                    value={values.typeUnfollow}
                    onChange={changeTypeUnfollow}
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
              {values.typeUnfollow === 'random' && (
                <div className="component-item numberOfGroup_Friends">
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
                      type="text"
                      name="Start"
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
                      type="text"
                      name="End"
                      value={values.numberEnd}
                      onChange={(event) => changeNumberEnd(event.target.value)}
                    />
                  </div>
                </div>
              )}
              {values.typeUnfollow === 'user' && (
                <div className="UIDContent">
                  <div className="UID_Header">
                    <p>User list</p>
                  </div>
                  <div className="component-item " style={{ position: 'relative' }}>
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                      <Editor
                        value={textContent}
                        onValueChange={(text) => {
                          setTextContent(text);
                        }}
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
                        <span style={{ marginRight: '14px' }}>1</span>Enter the content here
                      </p>
                      <p>
                        <span>2</span>Each content/line
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnFollow;
