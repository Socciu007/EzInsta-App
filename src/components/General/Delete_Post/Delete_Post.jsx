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
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const Delete_Post = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['deletePost']);
  const [textContent, setTextContent] = useState('');

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.text && currentSetup.text.length) {
        setTextContent(currentSetup.text.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n'), lineCount: textContent.split('\n').length });
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

  const changeViewTimeStart = (viewTime) => {
    setValues({ ...values, viewTimeStart: parseToNumber(viewTime) });
  };

  const changeViewTimeEnd = (viewTime) => {
    setValues({ ...values, viewTimeEnd: parseToNumber(viewTime) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };

  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };
  return (
    <div className="Delete_Post">
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
              <p>Delete post</p>
            </div>
            <div className="PostUIDList">
              <p className="selectComment__header">
                Post UID list
                <span style={{ marginLeft: '2px' }}>({values.lineCount})</span>
              </p>
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
                    textareaId="codeArea"
                    style={{
                      background: '#f5f5f5',
                      fontSize: 15,
                    }}
                  />
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
            </div>

            <div className="component-item viewTime">
              <p className="component-item__header">
                View time<span style={{ marginLeft: '2px' }}> (s):</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delete_Post;
