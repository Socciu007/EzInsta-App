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
// import MenuItem from '@mui/material/MenuItem';
// import Select from '@mui/material/Select';
import { parseToNumber } from '../../../services/utils.js';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { Select } from 'antd';
const PostInteraction = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['seedingPost']);
  const [userContent, setUserContent] = useState('');
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.postUID && currentSetup.postUID.length) {
        setTextContent(currentSetup.postUID.join('\n'));
      }
      if (currentSetup.userList && currentSetup.userList.length) {
        setUserContent(currentSetup.userList.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, postUID: textContent.split('\n'), lineCount: textContent.split('\n').length });
    }
  }, [textContent]);

  useEffect(() => {
    if (userContent.length) {
      setValues({ ...values, userList: userContent.split('\n') });
    }
  }, [userContent]);

  const changeTypeShare = (value) => {
    setValues({ ...values, typeShare: value });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const changeViewTimeStart = (group) => {
    setValues({ ...values, viewTimeStart: parseToNumber(group) });
  };
  const changeViewTimeEnd = (group) => {
    setValues({ ...values, viewTimeEnd: parseToNumber(group) });
  };

  const handleChangeLike = (value) => {
    setValues({ ...values, isLike: value });
  };
  const changeLikeStart = (value) => {
    setValues({ ...values, likeStart: parseToNumber(value) });
  };
  const changeLikeEnd = (value) => {
    setValues({ ...values, likeEnd: parseToNumber(value) });
  };
  const handleChangeComment = (value) => {
    setValues({ ...values, isComment: value });
  };
  const changeCommentStart = (value) => {
    setValues({ ...values, commentStart: parseToNumber(value) });
  };
  const changeCommentEnd = (value) => {
    setValues({ ...values, commentEnd: parseToNumber(value) });
  };
  const handleChangeShare = (value) => {
    setValues({ ...values, isShare: value });
  };

  const handleDivKeywordClick = () => {
    document.getElementById('keyword').focus();
  };

  const handleDivUserListClick = () => {
    document.getElementById('userList').focus();
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
              <p>Post interaction</p>
            </div>
            <div className="KeywordContent">
              <div className="Keyword_Header">
                <p>Post UID list</p>
                {/* <span>({values.lineCount})</span> */}
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
                    <span>1</span>Enter the UID list here
                  </p>
                  <p>
                    <span>2</span>Each UID/line
                  </p>
                </div>
              </div>
            </div>
            <div className="component-item__joinGroup">
              <div className="component-item numberOfGroups">
                <p className="component-item__header">
                  View time <span style={{ marginLeft: '2px' }}>(s):</span>
                </p>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeViewTimeStart(values.viewTimeStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeViewTimeStart(values.viewTimeStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={values.viewTimeStart}
                    onChange={(event) => changeViewTimeStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeViewTimeEnd(values.viewTimeEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeViewTimeEnd(values.viewTimeEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={values.viewTimeEnd}
                    onChange={(event) => changeViewTimeEnd(event.target.value)}
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
              <div className="component-item">
                <div className="component-item__header liked">
                  <input
                    type="checkbox"
                    name="isLike"
                    checked={values.isLike}
                    onChange={(event) => handleChangeLike(event.target.checked)}
                  />
                  <p>Random Like:</p>
                </div>
                <div className={`component-item__content ${values.isLike ? 'show' : 'hide'}`}>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => {
                          changeLikeStart(values.likeStart + 1);
                        }}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => {
                          changeLikeStart(values.likeEnd - 1);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="Start"
                      value={!values.isLike ? 0 : values.likeStart}
                      onChange={(event) => changeLikeStart(event.target.value)}
                    />
                  </div>
                  <span>to</span>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => {
                          changeLikeEnd(values.likeEnd + 1);
                        }}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => {
                          changeLikeEnd(values.likeEnd - 1);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="End"
                      value={!values.isLike ? 0 : values.likeEnd}
                      onChange={(event) => changeLikeEnd(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="component-item">
                <div className="component-item__header liked">
                  <input
                    type="checkbox"
                    name="isLike"
                    checked={values.isComment}
                    onChange={(event) => handleChangeComment(event.target.checked)}
                  />
                  <p>Random comment:</p>
                </div>
                <div className={`component-item__content ${values.isComment ? 'show' : 'hide'}`}>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => {
                          changeCommentStart(values.commentStart + 1);
                        }}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => {
                          changeCommentStart(values.commentStart - 1);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="Start"
                      value={!values.isComment ? 0 : values.commentStart}
                      onChange={(event) => changeCommentStart(event.target.value)}
                    />
                  </div>
                  <span>to</span>
                  <div className="component-item__number">
                    <div className="component-item__number__icon">
                      <img
                        src={iconIncrease}
                        alt="Increase icon"
                        onClick={() => {
                          changeCommentEnd(values.commentEnd + 1);
                        }}
                      />
                      <img
                        src={iconDecrease}
                        alt="Decrease icon"
                        onClick={() => {
                          changeCommentEnd(values.commentEnd - 1);
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="End"
                      value={!values.isComment ? 0 : values.commentEnd}
                      onChange={(event) => changeCommentEnd(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="component-item">
                <div className="component-item__header">
                  <input
                    type="checkbox"
                    name="isShare"
                    checked={values.isShare}
                    onChange={(event) => handleChangeShare(event.target.checked)}
                  />
                  <p>Share:</p>
                </div>
              </div>
              {values.isShare && (
                <div className="component-item -type-follower">
                  <div className="PostContent">
                    <Select
                      id="typeProfile"
                      className="PostContent__select PostContent__details"
                      value={values.typeShare}
                      onChange={changeTypeShare}
                      bordered={false}
                      options={[
                        {
                          value: 'user',
                          label: 'User',
                        },
                      ]}
                    />
                    {/* </div> */}
                  </div>
                </div>
              )}
              {values.typeShare === 'user' && (
                <div className="KeywordContent">
                  <div className="Keyword_Header">
                    <h>User list</h>
                    {/* <span>({values.lineCount})</span> */}
                  </div>
                  <div className="component-item " style={{ position: 'relative' }}>
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
                        Enter the content here
                        {/* <span>1</span>Enter the content here */}
                      </p>
                      {/* <p>
                      <span>2</span>Each UID/line
                    </p> */}
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

export default PostInteraction;
