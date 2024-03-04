import React, { useEffect, useRef, useState } from 'react';
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

const AddFriend = ({ onGoBackClick, id, currentSetup, component, updateDesignScript }) => {
  const initialValues = DefaultSciptSettings['addFriend'];

  const [values, setValues] = useState(initialValues);
  const [textContent, setTextContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }
      if (currentSetup.comment && currentSetup.comment.length) {
        setCommentContent(currentSetup.comment.join('\n'));
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
    if (commentContent.length) {
      setValues({ ...values, comment: commentContent.split('\n') });
    }
  }, [commentContent]);

  const changeOption = (value) => {
    setValues({ ...values, option: value });
    switch (value) {
      case 'UID':
        setPlaceholderText('Enter the UID list here\nEach UID/line');
        break;
      case 'UIDList':
        setPlaceholderText('Enter the UID list here\nEach UID/line');
        break;
      case 'keywords':
        setPlaceholderText('Enter the keyword list here\nEach keyword/line');
        break;
      case 'groupMembers':
        setPlaceholderText('Enter the group UID here\nEach UID/line');
        break;
      case 'friendOfUID':
        setPlaceholderText('Enter the UID here\nEach UID/line');
        break;
      default:
        setPlaceholderText('');
    }
  };

  const changeOnlyAddFriend = (value) => {
    setValues({ ...values, isOnlyAddFriend: value });
  };

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

  const changeDelayTimeInteractStart = (time) => {
    setValues({ ...values, delayTimeInteractStart: parseToNumber(time) });
  };
  const changeDelayTimeInteractEnd = (time) => {
    setValues({ ...values, delayTimeInteractEnd: parseToNumber(time) });
  };

  const changeRequestStart = (request) => {
    setValues({ ...values, requestsStart: parseToNumber(request) });
  };
  const changeRequestEnd = (request) => {
    setValues({ ...values, requestsEnd: parseToNumber(request) });
  };

  const changeStopTime = (time) => {
    setValues({ ...values, stopTime: parseToNumber(time) });
  };

  const handleDivClick = () => {
    document.getElementById('textareaContent').focus();
  };
  const handleChangeInteract = (value) => {
    setValues({ ...values, isInteract: value });
  };
  const handleChangeAutoDelete = (value) => {
    setValues({ ...values, isAutoDelete: value });
  };
  const handleChangeLiked = (value) => {
    setValues({ ...values, isLiked: value });
  };
  const handleChangeComment = (value) => {
    setValues({ ...values, isComment: value });
  };
  const handleDivCommentClick = () => {
    document.getElementById('codeArea').focus();
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="Add_Friend">
      <div className="component_container">
        <div className="scrollable-container">
          <div className="component-left">
            <div className="goBack titleAddFriend">
              <img
                src={backButton}
                alt="Back button"
                onClick={() => {
                  onGoBackClick();
                }}
              />
              <p>Add friends</p>
            </div>
            <div className="component-item addFriend">
              <div className="component-item__header">
                <p>Select Add friend type</p>
              </div>
              <div className="addFriendContent">
                <div className="component-item addFriendOption">
                  <Select
                    value={values.option}
                    onChange={(event) => changeOption(event.target.value)}
                    name="addFriendOption"
                    className="addFriendType"
                  >
                    <MenuItem value="suggestions">By suggestions</MenuItem>
                    <MenuItem value="acceptFriendRequests">Accept friend requests</MenuItem>
                    <MenuItem value="UIDList">UID list</MenuItem>
                    <MenuItem value="keywords">By keywords</MenuItem>
                    <MenuItem value="groupMembers">Group members</MenuItem>
                    <MenuItem value="friendOfFriends">Friend of friends</MenuItem>
                    <MenuItem value="friendOfUID">Friend of UID</MenuItem>
                  </Select>
                </div>
                {(values.option === 'UIDList' ||
                  values.option === 'keywords' ||
                  values.option === 'groupMembers' ||
                  values.option === 'friendOfUID') && (
                  <div>
                    <div style={{ position: 'relative' }} className="component-item">
                      <div className="textAddFriend" style={{ width: '100%', height: 204, overflow: 'auto' }}>
                        <Editor
                          value={textContent}
                          onValueChange={(text) => {
                            setTextContent(text);
                          }}
                          highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                          padding={15}
                          className="editor"
                          textareaId="textareaContent"
                          style={{
                            background: '#F5F5F5',
                            fontSize: 15,
                          }}
                        />
                      </div>
                      <div
                        onClick={handleDivClick}
                        id="placeholderTypeAddFriend"
                        className={`placeholder ${textContent ? 'hide' : ''}`}
                      >
                        <p>
                          <span>1</span>
                          {placeholderText.split('\n')[0]}
                        </p>
                        <p>
                          <span>2</span>
                          {placeholderText.split('\n')[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                {values.option === 'UIDList' && (
                  <div>
                    <div className="component-item autoDelete">
                      <input
                        type="checkbox"
                        name="autoDelete"
                        id="autoDelete"
                        checked={values.isAutoDelete}
                        onChange={(event) => handleChangeAutoDelete(event.target.checked)}
                      />
                      <p>Automatically delete the UID that sent the friend request</p>
                    </div>

                    <div className="component-item Interact">
                      <input
                        type="checkbox"
                        name="Interact"
                        checked={values.isInteract}
                        onChange={(event) => handleChangeInteract(event.target.checked)}
                      />
                      <p>Interact before sending friend request</p>
                    </div>

                    <div className={`component-item InteractContent ${values.isInteract ? 'show' : 'hide'}`}>
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
                          Delay time<span style={{ marginLeft: '2px' }}>(s):</span>
                        </p>
                        <div className="component-item__number">
                          <div className="component-item__number__icon">
                            <img
                              src={iconIncrease}
                              alt="Increase icon"
                              onClick={() => {
                                changeDelayTimeInteractStart(values.delayTimeInteractStart + 1);
                              }}
                            />
                            <img
                              src={iconDecrease}
                              alt="Decrease icon"
                              onClick={() => {
                                changeDelayTimeInteractStart(values.delayTimeInteractStart - 1);
                              }}
                            />
                          </div>
                          <input
                            name="Start"
                            type="text"
                            value={values.delayTimeInteractStart}
                            onChange={(event) => changeDelayTimeInteractStart(event.target.value)}
                          />
                        </div>
                        <span>to</span>
                        <div className="component-item__number">
                          <div className="component-item__number__icon">
                            <img
                              src={iconIncrease}
                              alt="Increase icon"
                              onClick={() => {
                                changeDelayTimeInteractEnd(values.delayTimeInteractEnd + 1);
                              }}
                            />
                            <img
                              src={iconDecrease}
                              alt="Decrease icon"
                              onClick={() => {
                                changeDelayTimeInteractEnd(values.delayTimeInteractEnd - 1);
                              }}
                            />
                          </div>
                          <input
                            name="End"
                            type="text"
                            value={values.delayTimeInteractEnd}
                            onChange={(event) => changeDelayTimeInteractEnd(event.target.value)}
                          />
                        </div>
                      </div>
                      <div className="inputLike">
                        <input
                          type="checkbox"
                          name="Like"
                          checked={values.isLiked}
                          id="inputLike"
                          onChange={(event) => handleChangeLiked(event.target.checked)}
                        />
                        <p>Like</p>
                      </div>
                      <div className="inputComment">
                        <input
                          type="checkbox"
                          name="Comment"
                          id="inputComment"
                          checked={values.isComment}
                          onChange={(event) => handleChangeComment(event.target.checked)}
                        />
                        <p>Comment</p>
                      </div>
                      <div
                        style={{ position: 'relative' }}
                        className={`component-item  ${values.isComment ? 'show' : 'hide'}`}
                      >
                        <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="textComment">
                          <Editor
                            value={commentContent}
                            onValueChange={(text) => {
                              setCommentContent(text);
                            }}
                            highlight={(code) => hightlightWithLineNumbers(code, languages.js, commentContent)}
                            padding={15}
                            className="editor"
                            textareaId="codeArea"
                            style={{
                              background: '#fff',
                              fontSize: 15,
                            }}
                          />
                        </div>
                        <div className={`placeholder ${commentContent ? 'hide' : ''}`} onClick={handleDivCommentClick}>
                          <p>
                            <span>1</span>
                            <span>Enter the content here</span>
                          </p>
                          <p>
                            <span>2</span>
                            <span>Each content/line</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  {values.option === 'suggestions' && (
                    <div className="component-item stopTimeAfterWarning">
                      <p>
                        Stop after Facebook warning <span style={{ marginLeft: '2px' }}>(times):</span>
                      </p>
                      <div className="component-item__number">
                        <div className="component-item__number__icon">
                          <img
                            src={iconIncrease}
                            alt="Increase icon"
                            onClick={() => {
                              changeStopTime(values.stopTime + 1);
                            }}
                          />
                          <img
                            src={iconDecrease}
                            alt="Decrease icon"
                            onClick={() => {
                              changeStopTime(values.stopTime - 1);
                            }}
                          />
                        </div>
                        <input
                          name="Start"
                          type="text"
                          value={values.stopTime}
                          onChange={(event) => changeStopTime(event.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {(values.option === 'suggestions' || values.option === 'acceptFriendRequests') && (
                    <div className="component-item addFriendHaveMutualFriend">
                      <input
                        type="checkbox"
                        name="addFriendHaveMutualFriend"
                        checked={values.isOnlyAddFriend}
                        id="checkboxAddFriend"
                        onChange={(event) => changeOnlyAddFriend(event.target.checked)}
                      />
                      <p>Only add friends with people who have mutual friends</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
