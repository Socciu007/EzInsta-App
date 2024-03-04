// eslint-disable-next-line no-unused-vars
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
const LeaveGroup = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['leftGroup']);
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
      setValues({ ...values, text: textContent.split('\n') });
    }
  }, [textContent]);

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const changeGroupStart = (group) => {
    setValues({ ...values, groupStart: parseToNumber(group) });
  };
  const changeGroupEnd = (group) => {
    setValues({ ...values, groupEnd: parseToNumber(group) });
  };

  const changeMember = (member) => {
    setValues({ ...values, member: parseToNumber(member) });
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
    <div className="leaveGroup">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleLeaveGroup">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Leave group</p>
            </div>
            <div className="component-content__leaveGroup">
              <div className="component-item numberOfGroups">
                <p className="component-item__header">Number of groups:</p>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeGroupStart(values.groupStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeGroupStart(values.groupStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={values.groupStart}
                    onChange={(event) => changeGroupStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeGroupEnd(values.groupEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeGroupEnd(values.groupEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={values.groupEnd}
                    onChange={(event) => changeGroupEnd(event.target.value)}
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
              <div className="LeaveGroup_Selection">
                <p className="component-item__header">Select Leave group type</p>
                <div className="component-item LeaveGroupOption">
                  <Select
                    name="LeaveGroupOption"
                    className="LeaveGroupType"
                    onChange={(event) => {
                      changeOption(event.target.value);
                    }}
                    value={values.option}
                  >
                    <MenuItem value="random">Random</MenuItem>
                    <MenuItem value="approve">Group needs Admin to approve posts</MenuItem>
                    <MenuItem value="conditional">Conditional</MenuItem>
                  </Select>
                </div>
                {values.option === 'conditional' && (
                  <div className="conditional">
                    <div className="component-item delayTime">
                      <p>Number of members less than:</p>
                      <div className="component-item__number">
                        <div className="component-item__number__icon">
                          <img src={iconIncrease} alt="Increase icon" onClick={() => changeMember(values.member + 1)} />
                          <img src={iconDecrease} alt="Decrease icon" onClick={() => changeMember(values.member - 1)} />
                        </div>
                        <input
                          type="text"
                          name="Start"
                          value={values.member}
                          onChange={(event) => changeMember(event.target.value)}
                          style={{ background: '#FFF' }}
                        />
                      </div>
                    </div>
                    <div className="KeywordContent">
                      <p>The group name contains the following keywords:</p>
                      <div className="component-item " style={{ position: 'relative' }}>
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="keywordText">
                          <Editor
                            value={textContent}
                            onValueChange={(text) => setTextContent(text)}
                            highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                            padding={15}
                            className="editor"
                            textareaId="codeArea"
                            style={{
                              background: '#fff',
                              fontSize: 15,
                              color: '#333',
                            }}
                          />
                        </div>
                        <div onClick={handleDivClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                          <p>
                            <span>1 </span>
                            <p>Enter the keyword here</p>
                          </p>
                          <p>
                            <span>2</span>
                            <p>Each keyword/line</p>
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

export default LeaveGroup;
