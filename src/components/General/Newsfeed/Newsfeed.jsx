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
import 'prismjs/themes/prism.css';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
const Newsfeed = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [textContent, setTextContent] = useState('');
  const [shareContent, setShareContent] = useState('');
  const [values, setValues] = useState(DefaultSciptSettings['newsFeed']);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.commentText && currentSetup.commentText.length) {
        setTextContent(currentSetup.commentText.join('\n'));
      }
      if (currentSetup.shareText && currentSetup.shareText.length) {
        setShareContent(currentSetup.shareText.join('\n'));
      }
      setTimeout(() => {
        setValues(currentSetup);
      }, 20);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, commentText: textContent.split('\n') });
    } else {
      setValues({ ...values, commentText: [] });
    }
  }, [textContent]);

  useEffect(() => {
    if (shareContent.length) {
      setValues({ ...values, shareText: shareContent.split('\n') });
    } else {
      setValues({ ...values, shareText: [] });
    }
  }, [shareContent]);

  const changeTimeStart = (time) => {
    setValues({ ...values, scrollTimeStart: parseToNumber(time) });
  };

  const changeTimeEnd = (time) => {
    setValues({ ...values, scrollTimeEnd: parseToNumber(time) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const handleChangeLiked = (value) => {
    setValues({ ...values, isLike: value });
  };

  const handleChangeShared = (value) => {
    setValues({ ...values, isShare: value });
  };

  const handleChangeComment = (value) => {
    setValues({ ...values, isComment: value });
  };

  const handleChangeLikeStart = (value) => {
    setValues({ ...values, likeStart: parseToNumber(value) });
  };
  const handleChangeLikeEnd = (value) => {
    setValues({ ...values, likeEnd: parseToNumber(value) });
  };

  // const handleChangeShareStart = (value) => {
  //   setValues({ ...values, shareStart: parseToNumber(value) });
  // };

  // const handleChangeShareEnd = (value) => {
  //   setValues({ ...values, shareEnd: parseToNumber(value) });
  // };

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };
  const handleDivShareClick = () => {
    document.getElementById('shareContent').focus();
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  const changeOption = (value) => {
    setValues({ ...values, typeShare: value });
  };

  return (
    <div className="newsfeed">
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
              <p>Newsfeed</p>
            </div>
            <div className="component-item scrollTime">
              <p className="component-item__header">Browsing time (s):</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeTimeStart(values.scrollTimeStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeStart(values.scrollTimeStart - 1 > 0 ? values.scrollTimeStart - 1 : 0);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="Start"
                  value={values.scrollTimeStart}
                  onChange={(event) => changeTimeStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeTimeEnd(values.scrollTimeEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeEnd(values.scrollTimeEnd - 1 > 0 ? values.scrollTimeEnd - 1 : 0);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="End"
                  value={values.scrollTimeEnd}
                  onChange={(event) => changeTimeEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item delayTime">
              <p className="component-item__header">Delay time (s):</p>
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
                      changeDelayTimeStart(values.delayTimeStart - 1 > 0 ? values.delayTimeStart - 1 : 0);
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
                      changeDelayTimeEnd(values.delayTimeEnd - 1 > 0 ? values.delayTimeEnd - 1 : 0);
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
            <div className="component-item Like">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomLike"
                  checked={values.isLike}
                  onChange={(event) => handleChangeLiked(event.target.checked)}
                />
                <p>Random Like :</p>
              </div>
              <div className={`component-item__content ${values.isLike ? 'show' : 'hide'}`}>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => handleChangeLikeStart(values.likeStart + 1)}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => handleChangeLikeStart(values.likeStart - 1 > 0 ? values.likeStart - 1 : 0)}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={values.likeStart}
                    onChange={(event) => handleChangeLikeStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => handleChangeLikeEnd(values.likeEnd + 1)}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => handleChangeLikeEnd(values.likeEnd - 1 > 0 ? values.likeEnd - 1 : 0)}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={values.likeEnd}
                    onChange={(event) => handleChangeLikeEnd(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="component-item comment">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomComment"
                  checked={values.isComment}
                  onChange={(event) => handleChangeComment(event.target.checked)}
                />
                <p>Random Comment</p>
              </div>
              <div className={`commentContent ${values.isComment ? 'show' : 'hide'}`}>
                <div className="Text">
                  <p style={{ fontWeight: 700 }}>Comment</p>
                  <div style={{ position: 'relative' }} className="component-item box">
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                      <Editor
                        value={textContent}
                        onValueChange={(text) => {
                          setTextContent(text);
                        }}
                        highlight={(code) => hightlightWithLineNumbers(code, languages.js, textContent)}
                        padding={15}
                        className="editor"
                        textareaId="codeArea"
                        onClick={handleDivClick}
                        style={{
                          background: '#FFFFFF',
                          fontSize: 15,
                        }}
                      />
                      {textContent.length ? null : (
                        <div onClick={handleDivClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                          <p>
                            <span style={{ marginLeft: '2px' }}>1</span>Enter the content here
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
            <div className="component-item share">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomShare"
                  checked={values.isShare}
                  onChange={(event) => handleChangeShared(event.target.checked)}
                />
                <p>Share :</p>
              </div>
              <div className={`PostContent ${values.isShare ? 'show' : 'hide'}`}>
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeOption(event.target.value)}
                    value={values.typeShare}
                    bordered={2 < 1 ? false : undefined}
                  >
                    <MenuItem value="randomShare">Share random</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </div>
                {values.typeShare === 'user' && (
                  <div className="commentContent">
                    <div className="Text">
                      <p style={{ fontWeight: 700 }}>User</p>
                      <div style={{ position: 'relative' }} className="component-item box">
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                          <Editor
                            value={shareContent}
                            onValueChange={(text) => {
                              setShareContent(text);
                            }}
                            highlight={(code) => hightlightWithLineNumbers(code, languages.js, shareContent)}
                            padding={15}
                            className="editor"
                            textareaId="shareContent"
                            onClick={handleDivShareClick}
                            style={{
                              background: '#FFFFFF',
                              fontSize: 15,
                            }}
                          />
                          {shareContent.length ? null : (
                            <div onClick={handleDivShareClick} className={`placeholder ${shareContent ? 'hide' : ''}`}>
                              <p>
                                <span style={{ marginLeft: '2px' }}>1</span>Enter the content here
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsfeed;
