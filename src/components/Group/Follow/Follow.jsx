// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import { languages, highlight } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { Select } from 'antd';
const Follow = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['follow']);
  const [userContent, setUserContent] = useState('');
  const [postContent, setPostContent] = useState('');
  const [searchContent, setSearchContent] = useState('');
  const [searchByKeyContent, setSearchByKeyContent] = useState('');
  const [searchByUserContent, setSearchByUserContent] = useState('');

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.postList && currentSetup.postList.length) {
        setPostContent(currentSetup.postList.join('\n'));
      }
      if (currentSetup.userList && currentSetup.userList.length) {
        setUserContent(currentSetup.userList.join('\n'));
      }
      if (currentSetup.search && currentSetup.search.length) {
        setSearchContent(currentSetup.search.join('\n'));
      }
      if (currentSetup.searchByKeyword && currentSetup.searchByKeyword.length) {
        setSearchByKeyContent(currentSetup.searchByKeyword.join('\n'));
      }
      if (currentSetup.searchByUser && currentSetup.searchByUser.length) {
        setSearchByUserContent(currentSetup.searchByUser.join('\n'));
      }
      setTimeout(() => {
        setValues(currentSetup);
      }, 50);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (postContent.length) {
      setValues({ ...values, postList: postContent.split('\n') });
    }
  }, [postContent]);

  useEffect(() => {
    if (userContent.length) {
      setValues({ ...values, userList: userContent.split('\n') });
    }
  }, [userContent]);

  useEffect(() => {
    if (searchContent.length) {
      setValues({ ...values, search: searchContent.split('\n') });
    }
  }, [searchContent]);

  useEffect(() => {
    if (searchByKeyContent.length) {
      setValues({ ...values, searchByKeyword: searchByKeyContent.split('\n') });
    }
  }, [searchByKeyContent]);

  useEffect(() => {
    if (searchByUserContent.length) {
      setValues({ ...values, searchByUser: searchByUserContent.split('\n') });
    }
  }, [searchByUserContent]);

  const changeNumberStart = (post) => {
    setValues({ ...values, numberStart: parseToNumber(post) });
  };

  const changeNumberEnd = (post) => {
    setValues({ ...values, numberEnd: parseToNumber(post) });
  };

  const changeTypeFollow = (value) => {
    setValues({ ...values, typeFollow: value });
  };

  const handleDivClick = () => {
    document.getElementById('userList').focus();
  };
  const handlePostDivClick = () => {
    document.getElementById('postList').focus();
  };
  const handleSearchDivClick = () => {
    document.getElementById('search').focus();
  };
  const handleSearchByKeyDivClick = () => {
    document.getElementById('byKey').focus();
  };
  const handleSearchByUserDivClick = () => {
    document.getElementById('byUser').focus();
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="createPostGroup">
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
              <p>Follow</p>
            </div>
            <div className="component-item numberOfPost">
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
            <div className="component-item">
              <div className="component-item__header">
                <p>Follow by:</p>
              </div>
            </div>
            <div className="component-item -type-follower">
              <div className="PostContent">
                <Select
                  id="typeProfile"
                  className="PostContent__select PostContent__details"
                  value={values.typeFollow}
                  onChange={changeTypeFollow}
                  bordered={false}
                  options={[
                    {
                      value: 'followers',
                      label: 'Follow the followers',
                    },
                    {
                      value: 'byUserLikePost',
                      label: "Follow user's liking posts",
                    },
                    {
                      value: 'byUserFollower',
                      label: "Follow user's follower",
                    },
                    {
                      value: 'byUserFollowing',
                      label: "Follow user's following",
                    },
                    {
                      value: 'searchByKey',
                      label: 'Follow base on keywords',
                    },
                    {
                      value: 'searchByUser',
                      label: 'Follow base on user',
                    },
                  ]}
                />
              </div>
            </div>
            {(values.typeFollow === 'byUserFollower' || values.typeFollow === 'byUserFollowing') && (
              <div className="UIDContent">
                <div className="UID_Header">
                  <p>User list</p>
                  {/* <span>({values.lineCount})</span> */}
                </div>
                <div className="component-item " style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
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
                  <div onClick={handleDivClick} className={`placeholder ${userContent ? 'hide' : ''}`}>
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
            {values.typeFollow === 'byUserLikePost' && (
              <div className="UIDContent">
                <div className="UID_Header">
                  <p>Post UID list</p>
                  {/* <span>({values.lineCount})</span> */}
                </div>
                <div className="component-item " style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                    <Editor
                      value={postContent}
                      onValueChange={(text) => {
                        setPostContent(text);
                      }}
                      highlight={(text) => hightlightWithLineNumbers(text, languages.js, postContent)}
                      padding={15}
                      className="editor"
                      textareaId="postList"
                      style={{
                        background: '#f5f5f5',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div onClick={handlePostDivClick} className={`placeholder ${postContent ? 'hide' : ''}`}>
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
            {(values.typeFollow === 'searchByKey' || values.typeFollow === 'searchByUser') && (
              <div className="UIDContent">
                <div className="UID_Header">
                  <p>Search</p>
                  {/* <span>({values.lineCount})</span> */}
                </div>
                <div className="component-item " style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                    <Editor
                      value={searchContent}
                      onValueChange={(text) => {
                        setSearchContent(text);
                      }}
                      highlight={(text) => hightlightWithLineNumbers(text, languages.js, searchContent)}
                      padding={15}
                      className="editor"
                      textareaId="search"
                      style={{
                        background: '#f5f5f5',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div onClick={handleSearchDivClick} className={`placeholder ${searchContent ? 'hide' : ''}`}>
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
            {values.typeFollow === 'searchByKey' && (
              <div className="UIDContent">
                <div className="UID_Header">
                  <p>Keyword</p>
                  {/* <span>({values.lineCount})</span> */}
                </div>
                <div className="component-item " style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                    <Editor
                      value={searchByKeyContent}
                      onValueChange={(text) => {
                        setSearchByKeyContent(text);
                      }}
                      highlight={(text) => hightlightWithLineNumbers(text, languages.js, searchByKeyContent)}
                      padding={15}
                      className="editor"
                      textareaId="byKey"
                      style={{
                        background: '#f5f5f5',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div
                    onClick={handleSearchByKeyDivClick}
                    className={`placeholder ${searchByKeyContent ? 'hide' : ''}`}
                  >
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
            {values.typeFollow === 'searchByUser' && (
              <div className="UIDContent">
                <div className="UID_Header">
                  <p>User</p>
                  {/* <span>({values.lineCount})</span> */}
                </div>
                <div className="component-item " style={{ position: 'relative' }}>
                  <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UIDText">
                    <Editor
                      value={searchByUserContent}
                      onValueChange={(text) => {
                        setSearchByUserContent(text);
                      }}
                      highlight={(text) => hightlightWithLineNumbers(text, languages.js, searchByUserContent)}
                      padding={15}
                      className="editor"
                      textareaId="byUser"
                      style={{
                        background: '#f5f5f5',
                        fontSize: 15,
                      }}
                    />
                  </div>
                  <div
                    onClick={handleSearchByUserDivClick}
                    className={`placeholder ${searchByUserContent ? 'hide' : ''}`}
                  >
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
  );
};

export default Follow;
