// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const FollowInteraction = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['followInteraction']);
  const [usernameList, setUsernameList] = useState('');
  const [textContent, setTextContent] = useState('');
  const [shareUserContent, setshareUserContent] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [shareRandomContent, setshareRandomContent] = useState('');
  const [randomMessage, setRandomMessage] = useState('');

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.commentText && currentSetup.commentText.length) {
        setTextContent(currentSetup.commentText.join('\n'));
      }
      if (currentSetup.shareUserText && currentSetup.shareUserText.length) {
        setshareUserContent(currentSetup.shareUserText.join('\n'));
      }
      if (currentSetup.shareRandomText && currentSetup.shareRandomText.length) {
        setshareRandomContent(currentSetup.shareRandomText.join('\n'));
      }
      if (currentSetup.usernameList && currentSetup.usernameList.length) {
        setUsernameList(currentSetup.usernameList.join('\n'));
      }
      if (currentSetup.randomMessage && currentSetup.randomMessage.length) {
        setRandomMessage(currentSetup.randomMessage.join('\n'));
      }
      if (currentSetup.userMessage && currentSetup.userMessage.length) {
        setUserMessage(currentSetup.userMessage.join('\n'));
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
    if (shareUserContent.length) {
      setValues({ ...values, shareUserText: shareUserContent.split('\n') });
    } else {
      setValues({ ...values, shareUserText: [] });
    }
  }, [shareUserContent]);
  useEffect(() => {
    if (userMessage.length) {
      setValues({ ...values, userMessage: userMessage.split('\n') });
    } else {
      setValues({ ...values, userMessage: [] });
    }
  }, [userMessage]);
  useEffect(() => {
    if (shareRandomContent.length) {
      setValues({ ...values, shareRandomText: shareRandomContent.split('\n') });
    } else {
      setValues({ ...values, shareRandomText: [] });
    }
  }, [shareRandomContent]);
  useEffect(() => {
    if (randomMessage.length) {
      setValues({ ...values, randomMessage: randomMessage.split('\n') });
    } else {
      setValues({ ...values, randomMessage: [] });
    }
  }, [randomMessage]);
  useEffect(() => {
    if (usernameList.length) {
      setValues({ ...values, usernameList: usernameList.split('\n') });
    } else {
      setValues({ ...values, usernameList: [] });
    }
  }, [usernameList]);

  const changeAccountStart = (num) => {
    setValues({ ...values, accountStart: parseToNumber(num) });
  };

  const changeAccountEnd = (num) => {
    setValues({ ...values, accountEnd: parseToNumber(num) });
  };

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
  const handleChangeUserStart = (value) => {
    setValues({ ...values, userStart: parseToNumber(value) });
  };
  const handleChangeUserEnd = (value) => {
    setValues({ ...values, userEnd: parseToNumber(value) });
  };
  const handleChangeLikeStart = (value) => {
    setValues({ ...values, likeStart: parseToNumber(value) });
  };
  const handleChangeLikeEnd = (value) => {
    setValues({ ...values, likeEnd: parseToNumber(value) });
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
  const handleChangeRandomStart = (value) => {
    setValues({ ...values, randomStart: parseToNumber(value) });
  };

  const handleChangeRandomEnd = (value) => {
    setValues({ ...values, randomEnd: parseToNumber(value) });
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };

  const handleUsernameClick = () => {
    document.getElementById('userContent').focus();
  };
  const handleChangeShared = (value) => {
    setValues({ ...values, isShare: value });
  };
  const handleDivShareClick = () => {
    document.getElementById('shareUserContent').focus();
  };
  const changeShareOption = (value) => {
    setValues({ ...values, typeShare: value });
  };
  const changeInteractOption = (value) => {
    setValues({ ...values, typeInteract: value });
  };
  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };
  const handleChangeRandomMessage = (value) => {
    setValues({ ...values, isRandomMessage: value });
  };
  const handleChangeUserMessage = (value) => {
    setValues({ ...values, isUserMessage: value });
  };
  const handleDivShareRandomClick = () => {
    document.getElementById('shareRandomContent').focus();
  };
  const handleDivShareUserClick = () => {
    document.getElementById('shareUserContent').focus();
  };
  const handleDivRandomMessageClick = () => {
    document.getElementById('messageRandomContent').focus();
  };
  const handleDivUserMessageClick = () => {
    document.getElementById('messageUserContent').focus();
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
              <p>Follow Interaction</p>
            </div>
            <div className="component-item share typeInteract">
              <div className="top">
                <div className="component-item__header">
                  <p>Interact with</p>
                </div>
              </div>
              <div className="PostContent">
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeInteractOption(event.target.value)}
                    value={values.typeInteract}
                    bordered={2 < 1 ? false : undefined}
                  >
                    <MenuItem value="follower">Follower</MenuItem>
                    <MenuItem value="following">Following</MenuItem>
                  </Select>
                </div>
              </div>
            </div>
            <div className="component-item share typeOption">
              <div className="top">
                <div className="component-item__header">
                  <p>Type </p>
                </div>
              </div>
              <div className="PostContent">
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeOption(event.target.value)}
                    value={values.option}
                    bordered={2 < 1 ? false : undefined}
                  >
                    <MenuItem value="random">Random</MenuItem>
                    <MenuItem value="username">Username</MenuItem>
                  </Select>
                </div>
                {values.option === 'username' && (
                  <div className="commentContent1">
                    <div className="Text">
                      <p style={{ fontWeight: 700 }}>Username list</p>
                      <div style={{ position: 'relative' }} className="component-item box">
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                          <Editor
                            value={usernameList}
                            onValueChange={(text) => {
                              setUsernameList(text);
                            }}
                            highlight={(code) => hightlightWithLineNumbers(code, languages.js, usernameList)}
                            padding={15}
                            className="editor"
                            textareaId="userContent"
                            onClick={handleUsernameClick}
                            style={{
                              background: '#FFFFFF',
                              fontSize: 15,
                            }}
                          />
                          {usernameList.length ? null : (
                            <div onClick={handleUsernameClick} className={`placeholder ${usernameList ? 'hide' : ''}`}>
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
            <div className="component-item watchingTime account">
              <p className="component-item__header">Number of accounts:</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeAccountStart(values.accountStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeAccountStart(values.accountStart - 1);
                    }}
                  />
                </div>
                <input
                  name="Start"
                  type="text"
                  value={values.accountStart}
                  onChange={(event) => changeAccountStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeAccountEnd(values.accountEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeAccountEnd(values.accountEnd - 1);
                    }}
                  />
                </div>
                <input
                  name="End"
                  type="text"
                  value={values.accountEnd}
                  onChange={(event) => changeAccountEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item watchingTime">
              <p className="component-item__header">View time (s):</p>
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
              <div className="top">
                <div className="component-item__header">
                  <input
                    type="checkbox"
                    name="randomComment"
                    checked={values.isComment}
                    onChange={(event) => changeComment(event.target.checked)}
                  />
                  <p>Random Comment</p>
                </div>
                <div className={`component-item__content  ${values.isComment ? 'show' : 'hide'}`}>
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
                  <p>Share :</p>
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
                      <div className="usernameWrapper">
                        <div className="username">
                          <p style={{ fontWeight: 700 }}>Keyword</p>
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => handleChangeUserStart(values.userStart + 1)}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() =>
                                  handleChangeUserStart(values.userStart - 1 > 0 ? values.userStart - 1 : 0)
                                }
                              />
                            </div>
                            <input
                              type="text"
                              name="Start"
                              value={values.userStart}
                              onChange={(event) => handleChangeUserStart(event.target.value)}
                            />
                          </div>
                          <span>to</span>
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => handleChangeUserEnd(values.userEnd + 1)}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() => handleChangeUserEnd(values.userEnd - 1 > 0 ? values.randomEnd - 1 : 0)}
                              />
                            </div>
                            <input
                              type="text"
                              name="End"
                              value={values.userEnd}
                              onChange={(event) => handleChangeUserEnd(event.target.value)}
                            />
                          </div>
                        </div>
                        <div style={{ position: 'relative' }} className="component-item box">
                          <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                            <Editor
                              value={shareUserContent}
                              onValueChange={(text) => {
                                setshareUserContent(text);
                              }}
                              highlight={(code) => hightlightWithLineNumbers(code, languages.js, shareUserContent)}
                              padding={15}
                              className="editor"
                              textareaId="shareUserContent"
                              onClick={handleDivShareUserClick}
                              style={{
                                background: '#FFFFFF',
                                fontSize: 15,
                              }}
                            />
                            {shareUserContent.length ? null : (
                              <div
                                onClick={handleDivShareUserClick}
                                className={`placeholder ${shareUserContent ? 'hide' : ''}`}
                              >
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
                      <div className="usernameMessage">
                        <div className="username">
                          <div className="message">
                            <input
                              type="checkbox"
                              name="randomShare"
                              checked={values.isUserMessage}
                              onChange={(event) => handleChangeUserMessage(event.target.checked)}
                            />
                            <p style={{ fontWeight: 700 }}>Message</p>
                          </div>
                        </div>
                        <div
                          style={{ position: 'relative' }}
                          className={`component-item box ${values.isUserMessage ? 'show' : 'hide'}`}
                        >
                          <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                            <Editor
                              value={userMessage}
                              onValueChange={(text) => {
                                setUserMessage(text);
                              }}
                              highlight={(code) => hightlightWithLineNumbers(code, languages.js, userMessage)}
                              padding={15}
                              className="editor"
                              textareaId="messageUserContent"
                              onClick={handleDivUserMessageClick}
                              style={{
                                background: '#FFFFFF',
                                fontSize: 15,
                              }}
                            />
                            {userMessage.length ? null : (
                              <div
                                onClick={handleDivUserMessageClick}
                                className={`placeholder ${userMessage ? 'hide' : ''}`}
                              >
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
                )}{' '}
                {values.typeShare === 'randomShare' && (
                  <div className="commentContent">
                    <div className="Text">
                      <div className="usernameWrapper">
                        <div className="username">
                          <p style={{ fontWeight: 700 }}>Quantity user/post</p>
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => handleChangeRandomStart(values.randomStart + 1)}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() =>
                                  handleChangeRandomStart(values.randomStart - 1 > 0 ? values.randomStart - 1 : 0)
                                }
                              />
                            </div>
                            <input
                              type="text"
                              name="Start"
                              value={values.randomStart}
                              onChange={(event) => handleChangeRandomStart(event.target.value)}
                            />
                          </div>
                          <span>to</span>
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => handleChangeRandomEnd(values.randomEnd + 1)}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() =>
                                  handleChangeRandomEnd(values.randomEnd - 1 > 0 ? values.randomEnd - 1 : 0)
                                }
                              />
                            </div>
                            <input
                              type="text"
                              name="End"
                              value={values.randomEnd}
                              onChange={(event) => handleChangeRandomEnd(event.target.value)}
                            />
                          </div>
                        </div>
                        <div style={{ position: 'relative' }} className="component-item box">
                          <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                            <Editor
                              value={shareRandomContent}
                              onValueChange={(text) => {
                                setshareRandomContent(text);
                              }}
                              highlight={(code) => hightlightWithLineNumbers(code, languages.js, shareRandomContent)}
                              padding={15}
                              className="editor"
                              textareaId="shareRandomContent"
                              onClick={handleDivShareRandomClick}
                              style={{
                                background: '#FFFFFF',
                                fontSize: 15,
                              }}
                            />
                            {shareRandomContent.length ? null : (
                              <div
                                onClick={handleDivShareRandomClick}
                                className={`placeholder ${shareRandomContent ? 'hide' : ''}`}
                              >
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
                      <div className="usernameMessage">
                        <div className="username">
                          <div className="message">
                            <input
                              type="checkbox"
                              name="randomShare"
                              checked={values.isRandomMessage}
                              onChange={(event) => handleChangeRandomMessage(event.target.checked)}
                            />
                            <p style={{ fontWeight: 700 }}>Message</p>
                          </div>
                        </div>
                        <div
                          style={{ position: 'relative' }}
                          className={`component-item box ${values.isRandomMessage ? 'show' : 'hide'}`}
                        >
                          <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                            <Editor
                              value={randomMessage}
                              onValueChange={(text) => {
                                setRandomMessage(text);
                              }}
                              highlight={(code) => hightlightWithLineNumbers(code, languages.js, randomMessage)}
                              padding={15}
                              className="editor"
                              textareaId="messageRandomContent"
                              onClick={handleDivRandomMessageClick}
                              style={{
                                background: '#FFFFFF',
                                fontSize: 15,
                              }}
                            />
                            {randomMessage.length ? null : (
                              <div
                                onClick={handleDivRandomMessageClick}
                                className={`placeholder ${randomMessage ? 'hide' : ''}`}
                              >
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowInteraction;
