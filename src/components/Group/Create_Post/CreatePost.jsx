// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.scss';
import iconDecrease from '../../../assets/icon/icon-Decrease.svg';
import iconIncrease from '../../../assets/icon/icon-Increase.svg';
import backButton from '../../../assets/icon/icon-back.svg';
import DragButton from '../../../assets/icon/icon-drag.svg';
import DeleteButton from '../../../assets/icon/icon-Delete.svg';
import Editor from 'react-simple-code-editor';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { languages, highlight } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import { useDropzone } from 'react-dropzone';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
const CreatePostGroup = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const initialValues = {
    postStart: 1,
    postEnd: 2,
    delayTimeStart: 5,
    delayTimeEnd: 10,
    option: 'text/photo',
    text: [],
    photos: [],
    photoStart: 1,
    photoEnd: 2,
    isTag: false,
    typeTag: 'random',
    numberFriendTagStart: 1,
    numberFriendTagEnd: 2,
    UID: [],
    UIDGroup: [],
    lineCount: 0,
  };

  const [values, setValues] = useState(DefaultSciptSettings['createPostGroup']);
  const [textContent, setTextContent] = useState('');
  const [UIDContent, setUIDContent] = useState('');
  const [UIDGroupContent, setUIDGroupContent] = useState('');

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
      if (currentSetup.UID && currentSetup.UID.length) {
        setUIDContent(currentSetup.UID.join('\n'));
      }
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }
      if (currentSetup.UIDGroup && currentSetup.UIDGroup.length) {
        setUIDGroupContent(currentSetup.UIDGroup.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n') });
    }
  }, [textContent]);

  useEffect(() => {
    if (UIDContent.length) {
      setValues({ ...values, UID: UIDContent.split('\n') });
    }
  }, [UIDContent]);

  useEffect(() => {
    if (UIDGroupContent.length) {
      setValues({ ...values, UIDGroup: UIDGroupContent.split('\n'), lineCount: UIDGroupContent.split('\n').length });
    }
  }, [UIDGroupContent]);

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

  const changeOption = (value) => {
    setValues({ ...values, option: value });
  };

  const changePhotoStart = (post) => {
    setValues({ ...values, photoStart: parseToNumber(post) });
  };

  const changePhotoEnd = (post) => {
    setValues({ ...values, photoEnd: parseToNumber(post) });
  };

  const changeTag = (value) => {
    setValues({ ...values, isTag: value });
  };
  const changeTypeTag = (value) => {
    setValues({ ...values, typeTag: value });
  };

  const changeNumberFriendTagStart = (value) => {
    setValues({ ...values, numberFriendTagStart: parseToNumber(value) });
  };
  const changeNumberFriendTagEnd = (value) => {
    setValues({ ...values, numberFriendTagEnd: parseToNumber(value) });
  };

  const handleDivClick = () => {
    document.getElementById('text').focus();
  };
  const handleUIDDivClick = () => {
    document.getElementById('UID').focus();
  };
  const handleDivUIDGroupClick = () => {
    document.getElementById('codeArea').focus();
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
              <p>Create post</p>
            </div>
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
            <div className="component-item Post">
              <div className="component-item__header">
                <p>Post options</p>
              </div>
              <div className="PostContent">
                <div className="component-item postOption">
                  <Select
                    name="postOption"
                    className="PostType"
                    onChange={(event) => changeOption(event.target.value)}
                    value={values.option}
                  >
                    <MenuItem value="background">Using background</MenuItem>
                    <MenuItem value="text/photo">Text, Photo/video</MenuItem>
                  </Select>
                </div>
                <div className="Text">
                  <p className="selectPost__header">Text</p>
                  <div style={{ position: 'relative' }} className="component-item">
                    <div className="text" style={{ width: '100%', height: 204, overflow: 'auto' }}>
                      <Editor
                        value={textContent}
                        onValueChange={(text) => {
                          setTextContent(text);
                        }}
                        highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                        padding={15}
                        className="editor"
                        textareaId="text"
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

                {values.option === 'text/photo' && (
                  <div className="photoOrVideo">
                    <p className="component-item__header">Photo/video</p>
                    <div className="component-item numberOfPost">
                      <p className="component-item__header numberOfPostText">Number of photo/video:</p>
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
                          name="Start"
                          type="text"
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
                          name="End"
                          type="text"
                          value={values.photoEnd}
                          onChange={(event) => changePhotoEnd(event.target.value)}
                        />
                      </div>
                    </div>
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
                            {values.photos.map((filePath, index) => (
                              <span key={index}>{filePath.replace(/^.*[\\/]/, '')}</span>
                            ))}
                          </div>
                        </div>
                        <img src={DeleteButton} alt="Delete Button" onClick={handleDeleteButtonClick} />
                      </div>
                    )}
                    <div className="component-item__header">
                      <input
                        type="checkbox"
                        checked={values.isTag}
                        name="CheckTag"
                        onChange={(event) => changeTag(event.target.checked)}
                      />
                      <p>Tag</p>
                    </div>
                    <div className={`component-item tag ${values.isTag ? 'show' : 'hide'}`}>
                      <div className="numberOfFriend">
                        <p>Number of friends:</p>
                        <div className="component-item__content">
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => {
                                  changeNumberFriendTagStart(values.numberFriendTagStart + 1);
                                }}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() => {
                                  changeNumberFriendTagStart(values.numberFriendTagStart - 1);
                                }}
                              />
                            </div>
                            <input
                              name="Start"
                              type="text"
                              value={values.numberFriendTagStart}
                              onChange={(event) => changeNumberFriendTagStart(event.target.value)}
                            />
                          </div>
                          <span>to</span>
                          <div className="component-item__number">
                            <div className="component-item__number__icon">
                              <img
                                src={iconIncrease}
                                alt="Increase icon"
                                onClick={() => {
                                  changeNumberFriendTagEnd(values.numberFriendTagEnd + 1);
                                }}
                              />
                              <img
                                src={iconDecrease}
                                alt="Decrease icon"
                                onClick={() => {
                                  changeNumberFriendTagEnd(values.numberFriendTagEnd - 1);
                                }}
                              />
                            </div>
                            <input
                              name="End"
                              type="text"
                              value={values.numberFriendTagEnd}
                              onChange={(event) => changeNumberFriendTagEnd(event.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <p>Friends</p>
                      <div className="component-item optionTag">
                        <Select
                          name="optionTag"
                          className="TagType"
                          onChange={(event) => {
                            changeTypeTag(event.target.value);
                          }}
                          value={values.typeTag}
                        >
                          <MenuItem value="random">Randomly tag among friends</MenuItem>
                          <MenuItem value="UID">UID list</MenuItem>
                        </Select>
                      </div>
                      {values.typeTag === 'UID' && (
                        <div style={{ position: 'relative' }} className="component-item">
                          <div className="text" style={{ width: '100%', height: 204, overflow: 'auto' }}>
                            <Editor
                              value={UIDContent}
                              onValueChange={(text) => {
                                setUIDContent(text);
                              }}
                              highlight={(text) => hightlightWithLineNumbers(text, languages.js, UIDContent)}
                              padding={15}
                              className="editor"
                              textareaId="UID"
                              style={{
                                background: '#f5f5f5',
                                fontSize: 15,
                              }}
                            />
                            <div onClick={handleUIDDivClick} className={`placeholder ${UIDContent ? 'hide' : ''}`}>
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
                    </div>
                  </div>
                )}
                <div className="UIDList">
                  <div className="UIDList__header">
                    <p>Group UID list</p>
                    <span>({values.lineCount})</span>
                  </div>
                  <div className="component-item" style={{ position: 'relative' }}>
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="UID">
                      <Editor
                        value={UIDGroupContent}
                        onValueChange={(text) => setUIDGroupContent(text)}
                        highlight={(text) => hightlightWithLineNumbers(text, languages.js, UIDGroupContent)}
                        padding={15}
                        className="editor"
                        textareaId="codeArea"
                        style={{
                          background: '#f5f5f5',
                          fontSize: 15,
                        }}
                      />
                    </div>

                    <div onClick={handleDivUIDGroupClick} className={`placeholder ${UIDGroupContent ? 'hide' : ''}`}>
                      <p>
                        <span>1</span>Enter the UID here
                      </p>
                      <p>
                        <span>2</span>Each UID/line
                      </p>
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

export default CreatePostGroup;
