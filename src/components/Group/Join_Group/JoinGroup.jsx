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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { parseToNumber } from '../../../services/utils.js';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
const JoinGroup = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['joinGroup']);
  const [answerContent, setAnswerContent] = useState('');
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }
      if (currentSetup.answer && currentSetup.answer.length) {
        setAnswerContent(currentSetup.answer.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n'), lineCount: textContent.split('\n').length });
    }
  }, [textContent]);

  useEffect(() => {
    if (answerContent.length) {
      setValues({ ...values, answer: answerContent.split('\n') });
    }
  }, [answerContent]);

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

  const handleDivKeywordClick = () => {
    document.getElementById('keyword').focus();
  };

  const handleDivAnswerClick = () => {
    document.getElementById('answer').focus();
  };

  const changeAnswer = (value) => {
    setValues({ ...values, isAutoAnswer: value });
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="joinGroup">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleJoinGroup">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick(values, component, id);
                }}
              />
              <p>Join group</p>
            </div>
            <div className="component-item__joinGroup">
              <div className="component-item__header">
                <p>Select Join group type</p>
              </div>
              <div className="JoinGroupContent">
                <div className="component-item JoinGroupOption">
                  <Select
                    name="JoinGroupOption"
                    className="JoinGroupType"
                    onChange={(event) => {
                      changeOption(event.target.value);
                    }}
                    value={values.option}
                  >
                    <MenuItem value="suggestions">By suggestions</MenuItem>
                    <MenuItem value="keywords">By keywords</MenuItem>
                    <MenuItem value="UID">By UID</MenuItem>
                  </Select>
                </div>
                {(values.option === 'suggestions' || values.option === 'keywords' || values.option === 'UID') && (
                  <div>
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
                    {(values.option === 'keywords' || values.option === 'UID') && (
                      <div className="KeywordContent">
                        <div className="Keyword_Header">
                          {values.option === 'keywords' && <p>Keyword list</p>}
                          {values.option === 'UID' && <p>UID list</p>}
                          <span>({values.lineCount})</span>
                        </div>
                        <div className="component-item " style={{ position: 'relative' }}>
                          <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="keywordText">
                            <Editor
                              value={textContent}
                              onValueChange={(text) => {
                                setTextContent(text);
                              }}
                              highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                              padding={15}
                              className="editor"
                              textareaId="keyword"
                              style={{
                                background: '#f5f5f5',
                                fontSize: 15,
                              }}
                            />
                          </div>

                          <div onClick={handleDivKeywordClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                            <p>
                              <span>1</span>Enter the keyword here
                            </p>
                            <p>
                              <span>2</span>Each keyword/line
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="AutoAnswerContent">
                      <div className="AutoAnswer_Header">
                        <input
                          type="checkbox"
                          name="autoAnswer"
                          checked={values.isAutoAnswer}
                          onChange={(event) => changeAnswer(event.target.checked)}
                        />
                        <p>Automatically answer the questions</p>
                      </div>
                      <div
                        style={{ position: 'relative' }}
                        className={`component-item  ${values.isAutoAnswer ? 'show' : 'hide'}`}
                      >
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="AutoAnswerText">
                          <Editor
                            value={answerContent}
                            onValueChange={(text) => setAnswerContent(text)}
                            highlight={(text) => hightlightWithLineNumbers(text, languages.js, answerContent)}
                            padding={15}
                            className="editor"
                            textareaId="answer"
                            style={{
                              background: '#f5f5f5',
                              fontSize: 15,
                            }}
                          />
                        </div>
                        <div onClick={handleDivAnswerClick} className={`placeholder ${answerContent ? 'hide' : ''}`}>
                          <p>
                            <span>1</span>Enter the answer here
                          </p>
                          <p>
                            <span>2</span>Each answer/line
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

export default JoinGroup;
