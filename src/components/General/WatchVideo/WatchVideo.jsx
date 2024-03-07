// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState, useCallback } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import DragButton from '../../../assets/icon/icon-drag.svg';
import DeleteButton from '../../../assets/icon/icon-Delete.svg';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { useDropzone } from 'react-dropzone';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const WatchVideo = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['watchVideo']);
  const [textContent, setTextContent] = useState('');
  const [shareContent, setShareContent] = useState('');
  // const { getRootProps, getInputProps } = useDropzone({
  //   maxFiles: 10,
  //   noClick: true,
  //   accept: {
  //     'image/png': ['.png', '.jpg', '.jpeg'],
  //   },
  //   onDrop: (acceptedFiles) => {
  //     const newFiles = acceptedFiles.map((file) => {
  //       console.log(file);
  //       return file.path;
  //     });

  //     setValues({ ...values, photos: [...values.photos, ...newFiles] });
  //   },
  // });
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 10,
    noClick: true,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/bmp': ['.bmp'],
      'image/gif': ['.gif'],
      'image/tiff': ['.tif', '.tiff'],
    },
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => {
        console.log(file);
        return file.path;
      });

      setValues({ ...values, photos: [...values.photos, ...newFiles] });
    },
  });

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

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
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };

  const changeVideoStart = (video) => {
    setValues({ ...values, videoStart: parseToNumber(video) });
  };

  const changeVideoEnd = (video) => {
    setValues({ ...values, videoEnd: parseToNumber(video) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const handleChangeLikeStart = (like) => {
    setValues({ ...values, likeStart: parseToNumber(like) });
  };
  const handleChangeLikeEnd = (like) => {
    setValues({ ...values, likeEnd: parseToNumber(like) });
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
  const changeLike = (value) => {
    setValues({ ...values, isLike: value });
  };

  const changeShare = (value) => {
    setValues({ ...values, isShare: value });
  };

  const changeComment = (value) => {
    setValues({ ...values, isComment: value });
  };

  const changeShareOption = (value) => {
    setValues({ ...values, typeShare: value });
  };
  const handleDivShareClick = () => {
    document.getElementById('shareContent').focus();
  };
  return (
    <div className="watch-video">
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
              <p>Watch Reels</p>
            </div>
            <div className="component-item numberOfVideo">
              <p className="component-item__header">Number of reels:</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeVideoStart(values.videoStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeVideoStart(values.videoStart - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="Start"
                  value={values.videoStart}
                  onChange={(event) => changeVideoStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeVideoEnd(values.videoEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeVideoEnd(values.videoEnd - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="End"
                  value={values.videoEnd}
                  onChange={(event) => changeVideoEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item watchingTime">
              <p className="component-item__header">
                Watching time <span style={{ marginLeft: '2px' }}>(s):</span>
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
            <div className="component-item Like">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomLike"
                  checked={values.isLike}
                  onChange={(event) => {
                    changeLike(event.target.checked);
                  }}
                />
                <p>Random Like :</p>
              </div>
              <div className={`component-item__content ${values.isLike ? 'show' : 'hide'}`}>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        handleChangeLikeStart(values.likeStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        handleChangeLikeStart(values.likeStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={!values.isLike ? 0 : values.likeStart}
                    onChange={(event) => handleChangeLikeStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        handleChangeLikeEnd(values.likeEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        handleChangeLikeEnd(values.likeEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={!values.isLike ? 0 : values.likeEnd}
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
              <div className="top">
                <div className="component-item__header">
                  <input
                    type="checkbox"
                    name="randomShare"
                    checked={values.isShare}
                    onChange={(event) => changeShare(event.target.checked)}
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

export default WatchVideo;
