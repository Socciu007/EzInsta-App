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

  const handleDeleteButtonClick = () => {
    setValues({ ...values, photos: [] });
  };

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

  const changeLikeStart = (like) => {
    setValues({ ...values, likeStart: parseToNumber(like) });
  };
  const changeLikeEnd = (like) => {
    setValues({ ...values, likeEnd: parseToNumber(like) });
  };

  const changeShareStart = (share) => {
    setValues({ ...values, shareStart: parseToNumber(share) });
  };
  const changeShareEnd = (share) => {
    setValues({ ...values, shareEnd: parseToNumber(share) });
  };

  const changeCommentStart = (comment) => {
    setValues({ ...values, commentStart: parseToNumber(comment) });
  };
  const changeCommentEnd = (comment) => {
    setValues({ ...values, commentEnd: parseToNumber(comment) });
  };

  const changePhotoStart = (photo) => {
    setValues({ ...values, photoStart: parseToNumber(photo) });
  };
  const changePhotoEnd = (photo) => {
    setValues({ ...values, photoEnd: parseToNumber(photo) });
  };

  const changeLike = (value) => {
    setValues({ ...values, isLiked: value });
  };

  const changeShare = (value) => {
    setValues({ ...values, isShare: value });
  };

  const changeComment = (value) => {
    setValues({ ...values, isComment: value });
  };

  const changeOption = (value) => {
    setValues({ ...values, option: value });
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
              <p>Watch video</p>
            </div>
            <div className="component-item numberOfVideo">
              <p className="component-item__header">Number of videos:</p>
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
                Watching time/video <span style={{ marginLeft: '2px' }}>(s):</span>
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
                  checked={values.isLiked}
                  onChange={(event) => {
                    changeLike(event.target.checked);
                  }}
                />
                <p>
                  Random Like{' '}
                  <span style={{ marginLeft: '2px' }} className={`span__content ${values.isLiked ? 'show' : 'hide'}`}>
                    (video)
                  </span>
                  :
                </p>
              </div>
              <div className={`component-item__content ${values.isLiked ? 'show' : 'hide'}`}>
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
                        changeLikeStart(values.likeStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={!values.isLiked ? 0 : values.likeStart}
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
                    value={!values.isLiked ? 0 : values.likeEnd}
                    onChange={(event) => changeLikeEnd(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="component-item share">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomShare"
                  checked={values.isShare}
                  onChange={(event) => {
                    changeShare(event.target.checked);
                  }}
                />
                <p>
                  Share to Feed{' '}
                  <span style={{ marginLeft: '2px' }} className={`span__content ${values.isShare ? 'show' : 'hide'}`}>
                    (video)
                  </span>
                  :
                </p>
              </div>
              <div className={`component-item__content ${values.isShare ? 'show' : 'hide'}`}>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => changeShareStart(values.shareStart + 1)}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => changeShareStart(values.shareStart - 1)}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={!values.isShare ? 0 : values.shareStart}
                    onChange={(event) => changeShareStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img src={iconIncrease} alt="Increase icon" onClick={() => changeShareEnd(values.shareEnd + 1)} />
                    <img src={iconDecrease} alt="Decrease icon" onClick={() => changeShareEnd(values.shareEnd - 1)} />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={!values.isShare ? 0 : values.shareEnd}
                    onChange={(event) => changeShareEnd(event.target.value)}
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
                  onChange={(event) => {
                    changeComment(event.target.checked);
                  }}
                />
                <p>Randomly Comment</p>
              </div>
              <div className={`commentContent ${values.isComment ? 'show' : 'hide'}`}>
                <div className="component-item comment__numberOfVideo">
                  <p className="component-item__header">Number of videos:</p>
                  <div className="component-item__content">
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
                <p className="selectComment__header">Select Comment type</p>
                <div className="component-item optionComment">
                  <Select
                    name="optionComment"
                    className="commentType"
                    onChange={(event) => {
                      changeOption(event.target.value);
                    }}
                    value={values.option}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="photoOrVideo">Photo/video</MenuItem>
                    <MenuItem value="all">Text & Photo/video</MenuItem>
                  </Select>
                </div>
                {(values.option === 'text' || values.option === 'all') && (
                  <div className="Text">
                    <p className="selectComment__header">Text</p>
                    <div className="component-item" style={{ position: 'relative' }}>
                      <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                        <Editor
                          value={textContent}
                          onValueChange={(text) => {
                            setTextContent(text);
                          }}
                          highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                          padding={15}
                          className="editor"
                          textareaId="codeArea"
                          style={{
                            background: '#f5f5f5',
                            fontSize: 15,
                          }}
                        />
                      </div>
                      <div onClick={handleDivClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
                        <p>
                          <span>1</span>Enter the content here
                        </p>
                        <p>
                          <span>2</span>Each content/line
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {(values.option === 'photoOrVideo' || values.option === 'all') && (
                  <div className="photoOrVideo">
                    <p className="component-item__header">Photo/video</p>
                    {/* <div className="component-item numberOfVideo">
                      <p className="component-item__header numberOfVideoText">Number of photo/video:</p>
                      <div className="component-item__number">
                        <div className="component-item__number__icon">
                          <img
                            src={iconIncrease}
                            alt="Increase icon"
                            onClick={() => {
                              changePhotoStart(values.photoStart + 1);
                            }}
                          />
                          <img
                            src={iconDecrease}
                            alt="Decrease icon"
                            onClick={() => {
                              changePhotoStart(values.photoStart - 1);
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          name="Start"
                          value={values.photoStart}
                          onChange={(event) => changePhotoStart(event.target.value)}
                        />
                      </div>
                      <span>to</span>
                      <div className="component-item__number">
                        <div className="component-item__number__icon">
                          <img
                            src={iconIncrease}
                            alt="Increase icon"
                            onClick={() => {
                              changePhotoEnd(values.photoEnd + 1);
                            }}
                          />
                          <img
                            src={iconDecrease}
                            alt="Decrease icon"
                            onClick={() => {
                              changePhotoEnd(values.photoEnd - 1);
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          name="End"
                          value={values.photoEnd}
                          onChange={(event) => changePhotoEnd(event.target.value)}
                        />
                      </div>
                    </div> */}

                    {values.photos.length === 0 ? (
                      <div {...getRootProps({ className: 'component-item dragVideoOrPhoto' })}>
                        <input {...getInputProps()} />
                        <img className="mx-auto h-40" src={DragButton} alt="addfile" />
                        <p>Drag the photo/video folder here</p>
                      </div>
                    ) : (
                      <div className={`folderPhoto`}>
                        <div className="URLImg">
                          <span style={{ opacity: '0.5' }}>Folder:</span>
                          <div style={{ width: '100%' }}>
                            {values.photos.map((fileName, index) => (
                              <span key={index}>{fileName}</span>
                            ))}
                          </div>
                        </div>
                        <img src={DeleteButton} alt="Delete Button" onClick={handleDeleteButtonClick} />
                      </div>
                    )}
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
