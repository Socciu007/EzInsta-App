import React, { useEffect, useState } from 'react';
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
const UpdateProfile = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['updateProfile']);
  const [textContent, setTextContent] = useState('');
  const [customGender, setCustomGender] = useState('');

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
      if (currentSetup.bio && currentSetup.bio.length) {
        setTextContent(currentSetup.bio.join('\n'));
      }
      if (currentSetup.customGender && currentSetup.customGender.length) {
        setCustomGender(currentSetup.customGender.join('\n'));
      }
      setTimeout(() => {
        setValues(currentSetup);
      }, 20);
    }
  }, [currentSetup]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, bio: textContent.split('\n') });
    } else {
      setValues({ ...values, bio: [] });
    }
  }, [textContent]);

  useEffect(() => {
    if (customGender.length) {
      setValues({ ...values, customGender: customGender.split('\n') });
    } else {
      setValues({ ...values, customGender: [] });
    }
  }, [customGender]);

  const changeGenderOption = (value) => {
    setValues({ ...values, gender: value });
  };
  const handleDivShareClick = () => {
    document.getElementById('shareContent').focus();
  };
  const handleDivClick = () => {
    document.getElementById('text').focus();
  };
  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="createPost">
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
              <p>Update Profile</p>
            </div>

            <div className="component-item Post">
              <div className="PostContent">
                <div className="photoOrVideo">
                  <p className="component-item__header">Update avatar</p>
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
                </div>

                <div className="Text">
                  <p className="selectPost__header">Update Bio</p>
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
                        <span style={{ marginLeft: '2px' }}>1</span>Enter the content here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="component-item share">
                  <div className="component-item__header">
                    <p>Gender</p>
                  </div>
                  <div className={`PostContent ${values.gender ? 'show' : 'hide'}`}>
                    <div className="component-item postOption">
                      <Select
                        name="postOption"
                        className="PostType"
                        onChange={(event) => changeGenderOption(event.target.value)}
                        value={values.gender}
                        bordered={2 < 1 ? false : undefined}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="custom">Custom</MenuItem>
                        <MenuItem value="hide">Prefer not to say</MenuItem>
                      </Select>
                    </div>
                    {values.gender === 'custom' && (
                      <div>
                        <div className="Text">
                          <div style={{ position: 'relative' }} className="component-item box">
                            <div style={{ width: '100%', height: 40, overflow: 'auto' }} className={`text`}>
                              <input
                                type="text"
                                style={{
                                  background: '#FFFFFF',
                                  fontSize: 15,
                                  border: 'none',
                                }}
                                value={customGender}
                                onChange={(event) => {
                                  setCustomGender(event.target.value);
                                }}
                                className="editor"
                                placeholder="Enter the content here"
                              />
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
      </div>
    </div>
  );
};

export default UpdateProfile;
