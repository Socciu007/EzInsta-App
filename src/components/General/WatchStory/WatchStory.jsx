// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import iconQuestion from '../../../assets/icon/icon-question.svg';
import Editor from 'react-simple-code-editor';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const WatchStory = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['watchStory']);
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
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

  const changeNumberStoryStart = (stories) => {
    setValues({ ...values, numberStoryStart: parseToNumber(stories) });
  };

  const changeNumberStoryEnd = (stories) => {
    setValues({ ...values, numberStoryEnd: parseToNumber(stories) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };
  const changeReact = (value) => {
    setValues({ ...values, isReact: value });
  };
  const changeComment = (value) => {
    setValues({ ...values, isComment: value });
  };
  const changeLike = (value) => {
    setValues({ ...values, isLike: value });
  };
  const changeLove = (value) => {
    setValues({ ...values, isLove: value });
  };
  const changeCare = (value) => {
    setValues({ ...values, isCare: value });
  };
  const changeWow = (value) => {
    setValues({ ...values, isWow: value });
  };
  const changeHaha = (value) => {
    setValues({ ...values, isHaha: value });
  };
  const changeSad = (value) => {
    setValues({ ...values, isSad: value });
  };
  const changeAngry = (value) => {
    setValues({ ...values, isAngry: value });
  };

  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };

  return (
    <div className={`watch-story`}>
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
              <p>Watch Story</p>
            </div>

            <div className="component-item watchingTime">
              <p className="component-item__header">Watching time (s):</p>
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
            <div className="component-item numberOfStory">
              <p className="component-item__header">Delay time(s):</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeNumberStoryStart(values.numberStoryStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeNumberStoryStart(values.numberStoryStart - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="Start"
                  value={values.numberStoryStart}
                  onChange={(event) => changeNumberStoryStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeNumberStoryEnd(values.numberStoryEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeNumberStoryEnd(values.numberStoryEnd - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="End"
                  value={values.numberStoryEnd}
                  onChange={(event) => changeNumberStoryEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item_react">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomLike"
                  checked={values.isReact}
                  onChange={(event) => {
                    changeReact(event.target.checked);
                  }}
                />
                <p>Random Like:</p>
              </div>
            </div>
            <div className="component-item comment">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomComment"
                  checked={values.isComment}
                  onChange={(event) => {
                    changeComment(event.target.checked);
                  }}
                />
                <p>Reply</p>
                {/* <img src={iconQuestion} alt="icon Question" /> */}
              </div>
              <div className={`commentContent Text ${values.isComment ? 'show' : 'hide'}`}>
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeOption(event.target.value)}
                    value={values.option}
                    bordered={false}
                    MuiButtonBase-root
                  >
                    <MenuItem value="text">Text</MenuItem>
                  </Select>
                </div>
                <div className="component-content">
                  <p style={{ fontWeight: 700 }}>Comment</p>
                  <div style={{ position: 'relative' }} className="component-item editor">
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                      <Editor
                        value={textContent}
                        onValueChange={(text) => {
                          setTextContent(text);
                        }}
                        highlight={(code) => hightlightWithLineNumbers(code, languages.js)}
                        padding={15}
                        className={`editor`}
                        textareaId="codeArea"
                        onClick={handleDivClick}
                        style={{
                          background: '#FFFFFF',
                          fontSize: 15,
                        }}
                      />
                      {textContent.length ? null : (
                        <div onClick={handleDivClick} className={`placeholder`}>
                          <p>
                            <span>1</span>Enter the content here
                          </p>
                          <p>
                            <span>2</span>Each content/line
                          </p>
                        </div>
                      )}
                    </div>
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

export default WatchStory;
