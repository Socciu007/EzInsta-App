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
import 'prismjs/themes/prism.css';
import { parseToNumber } from '../../../services/utils';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const Newsfeed = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [textContent, setTextContent] = useState('');
  const [values, setValues] = useState(DefaultSciptSettings['newsFeed']);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.commentStrs && currentSetup.commentStrs.length) {
        setTextContent(currentSetup.commentStrs.join('\n'));
      }
      setValues(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(values, component, id);
  }, [values]);

  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, commentStrs: textContent.split('\n') });
    }
  }, [textContent]);

  const changeTimeStart = (time) => {
    setValues({ ...values, scrollTimeStart: parseToNumber(time) });
  };

  const changeTimeEnd = (time) => {
    setValues({ ...values, scrollTimeEnd: parseToNumber(time) });
  };

  const changeDelayTimeStart = (time) => {
    setValues({ ...values, delayTimeStart: parseToNumber(time) });
  };
  const changeDelayTimeEnd = (time) => {
    setValues({ ...values, delayTimeEnd: parseToNumber(time) });
  };

  const handleChangeLiked = (value) => {
    setValues({ ...values, randomLike: value });
  };

  const handleChangeShared = (value) => {
    setValues({ ...values, randomShare: value });
  };

  const handleChangeComment = (value) => {
    setValues({ ...values, randomComment: value });
  };

  const handleChangeCommentStart = (value) => {
    setValues({ ...values, commentStart: parseToNumber(value) });
  };

  const handleChangeCommentEnd = (value) => {
    setValues({ ...values, commentEnd: parseToNumber(value) });
  };

  const handleChangeLikeStart = (value) => {
    setValues({ ...values, likeStart: parseToNumber(value) });
  };
  const handleChangeLikeEnd = (value) => {
    setValues({ ...values, likeEnd: parseToNumber(value) });
  };

  const handleChangeShareStart = (value) => {
    setValues({ ...values, shareStart: parseToNumber(value) });
  };

  const handleChangeShareEnd = (value) => {
    setValues({ ...values, shareEnd: parseToNumber(value) });
  };

  const handleDivClick = () => {
    document.getElementById('codeArea').focus();
  };
  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${textContent ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="newsfeed">
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
              <p>Newsfeed</p>
            </div>
            <div className="component-item scrollTime">
              <p className="component-item__header">View time (s):</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changeTimeStart(values.scrollTimeStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeStart(values.scrollTimeStart - 1 > 0 ? values.scrollTimeStart - 1 : 0);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="Start"
                  value={values.scrollTimeStart}
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
                      changeTimeEnd(values.scrollTimeEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changeTimeEnd(values.scrollTimeEnd - 1 > 0 ? values.scrollTimeEnd - 1 : 0);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="End"
                  value={values.scrollTimeEnd}
                  onChange={(event) => changeTimeEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="component-item delayTime">
              <p className="component-item__header">Delay time (s):</p>
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
                      changeDelayTimeStart(values.delayTimeStart - 1 > 0 ? values.delayTimeStart - 1 : 0);
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
                      changeDelayTimeEnd(values.delayTimeEnd - 1 > 0 ? values.delayTimeEnd - 1 : 0);
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
                  checked={values.randomLike}
                  onChange={(event) => handleChangeLiked(event.target.checked)}
                />
                <p>
                  Random Like{' '}
                  <span
                    style={{ marginLeft: '2px' }}
                    className={`span__content ${values.randomLike ? 'show' : 'hide'}`}
                  >
                    (post)
                  </span>
                  :
                </p>
              </div>
              <div className={`component-item__content ${values.randomLike ? 'show' : 'hide'}`}>
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
            <div className="component-item share">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomShare"
                  checked={values.randomShare}
                  onChange={(event) => handleChangeShared(event.target.checked)}
                />
                <p>
                  Share to Feed{' '}
                  <span
                    style={{ marginLeft: '2px' }}
                    className={`span__content ${values.randomShare ? 'show' : 'hide'}`}
                  >
                    (post)
                  </span>
                  :
                </p>
              </div>
              <div className={`component-item__content ${values.randomShare ? 'show' : 'hide'}`}>
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
                      onClick={() => handleChangeShareEnd(values.shareEnd - 1 > 0 ? values.shareEnd - 1 : 0)}
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
            <div className="component-item comment">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomComment"
                  checked={values.randomComment}
                  onChange={(event) => handleChangeComment(event.target.checked)}
                />
                <p>Randomly Comment</p>
              </div>
              <div className={`commentContent ${values.randomComment ? 'show' : 'hide'}`}>
                <div className="component-item comment__numberPost">
                  <p className="component-item__header">Number of posts:</p>
                  <div className="component-item__content">
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

                <div className="Text">
                  <div className="component-item__header">
                    <p>Text</p>
                  </div>
                  <div style={{ position: 'relative' }} className="component-item">
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className={`text`}>
                      <Editor
                        value={textContent}
                        onValueChange={(text) => {
                          setTextContent(text);
                        }}
                        highlight={(code) => hightlightWithLineNumbers(code, languages.js)}
                        padding={15}
                        className={`editor`}
                        textareaId="codeArea"
                        onClick={handleDivClick}
                        style={{
                          background: '#f5f5f5',
                          fontSize: 15,
                        }}
                      />
                      {textContent.length ? null : (
                        <div onClick={handleDivClick} className={`placeholder`}>
                          <p>
                            <span>1</span>Enter the content here
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsfeed;
