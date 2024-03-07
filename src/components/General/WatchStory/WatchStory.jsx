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
  const [shareContent, setShareContent] = useState('');
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
    setValues({ ...values, timeStart: parseToNumber(time) });
  };

  const changeTimeEnd = (time) => {
    setValues({ ...values, timeEnd: parseToNumber(time) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };
  const changeComment = (value) => {
    setValues({ ...values, isComment: value });
  };
  const handleChangeLiked = (value) => {
    setValues({ ...values, isLike: value });
  };
  const handleChangeLikeStart = (value) => {
    setValues({ ...values, likeStart: parseToNumber(value) });
  };

  const handleChangeCommentStart = (value) => {
    setValues({ ...values, commentStart: parseToNumber(value) });
  };

  const handleChangeCommentEnd = (value) => {
    setValues({ ...values, commentEnd: parseToNumber(value) });
  };
  const handleChangeShareStart = (value) => {
    setValues({ ...values, shareStart: parseToNumber(value) });
  };

  const handleChangeShareEnd = (value) => {
    setValues({ ...values, shareEnd: parseToNumber(value) });
  };

  const handleChangeLikeEnd = (value) => {
    setValues({ ...values, likeEnd: parseToNumber(value) });
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };
  const handleChangeShared = (value) => {
    setValues({ ...values, isShare: value });
  };
  const handleDivShareClick = () => {
    document.getElementById('shareContent').focus();
  };
  const changeCommentOption = (value) => {
    setValues({ ...values, typeComment: value });
  };
  const changeShareOption = (value) => {
    setValues({ ...values, typeShare: value });
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
                      changeTimeStart(values.timeStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeStart(values.timeStart - 1);
                    }}
                  />
                </div>
                <input
                  name="Start"
                  type="text"
                  value={values.timeStart}
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
                      changeTimeEnd(values.timeEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeEnd(values.timeEnd - 1);
                    }}
                  />
                </div>
                <input
                  name="End"
                  type="text"
                  value={values.timeEnd}
                  onChange={(event) => changeTimeEnd(event.target.value)}
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
                  type="text"
                  name="Start"
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
                  type="text"
                  name="End"
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
                <p>Random Like</p>
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
              <div className="top">
                <div className="component-item__header">
                  <input
                    type="checkbox"
                    name="randomComment"
                    checked={values.isComment}
                    onChange={(event) => changeComment(event.target.checked)}
                  />
                  <p>Reply Story</p>
                </div>
                <div className={`component-item__content ${values.isComment ? 'show' : 'hide'}`}>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => handleChangeCommentStart(values.commentStart + 1)}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() =>
                          handleChangeCommentStart(values.commentStart - 1 > 0 ? values.commentStart - 1 : 0)
                        }
                      />
                    </div>
                    <input
                      type="text"
                      name="Start"
                      value={values.commentStart}
                      onChange={(event) => handleChangeCommentStart(event.target.value)}
                    />
                  </div>
                  <span>to</span>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => handleChangeCommentEnd(values.commentEnd + 1)}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => handleChangeCommentEnd(values.commentEnd - 1 > 0 ? values.commentEnd - 1 : 0)}
                      />
                    </div>
                    <input
                      type="text"
                      name="End"
                      value={values.commentEnd}
                      onChange={(event) => handleChangeCommentEnd(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={` Text ${values.isComment ? 'show' : 'hide'}`}>
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeCommentOption(event.target.value)}
                    value={values.typeComment}
                    bordered={2 < 1 ? false : undefined}
                  >
                    <MenuItem value="text">Text</MenuItem>
                  </Select>
                </div>
                <div className="commentContent1">
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
                            <span style={{ marginLeft: '2px' }}>1</span>
                            Enter the content here
                          </p>
                          <p>
                            <span>2 </span>Each content/line
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="component-item share">
              <div className="top">
                <div className="component-item__header">
                  <input
                    type="checkbox"
                    name="randomShare"
                    checked={values.isShare}
                    onChange={(event) => handleChangeShared(event.target.checked)}
                  />
                  <p>Share Story</p>
                </div>
                <div className={`component-item__content ${values.isShare ? 'show' : 'hide'}`}>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => handleChangeShareStart(values.shareStart + 1)}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => handleChangeShareStart(values.shareStart - 1 > 0 ? values.shareStart - 1 : 0)}
                      />
                    </div>
                    <input
                      type="text"
                      name="Start"
                      value={values.shareStart}
                      onChange={(event) => handleChangeShareStart(event.target.value)}
                    />
                  </div>
                  <span>to</span>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => handleChangeShareEnd(values.shareEnd + 1)}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => handleChangeShareEnd(values.shareEnd - 1 > 0 ? values.commentEnd - 1 : 0)}
                      />
                    </div>
                    <input
                      type="text"
                      name="End"
                      value={values.shareEnd}
                      onChange={(event) => handleChangeShareEnd(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={`PostContent ${values.isShare ? 'show' : 'hide'}`}>
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeShareOption(event.target.value)}
                    value={values.typeShare}
                    bordered={2 < 1 ? false : undefined}
                  >
                    <MenuItem value="randomShare">Share random</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </Select>
                </div>
                {values.typeShare === 'user' && (
                  <div className="commentContent1">
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

export default WatchStory;
