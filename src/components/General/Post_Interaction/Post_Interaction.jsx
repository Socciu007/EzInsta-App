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

const Post_Interaction = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [values, setValues] = useState(DefaultSciptSettings['postInteract']);
  const [textContent, setTextContent] = useState('');
  const [UIDContent, setUIDContent] = useState('');

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.UID && currentSetup.UID.length) {
        setUIDContent(currentSetup.UID.join('\n'));
      }
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
    if (UIDContent.length) {
      setValues({ ...values, UID: UIDContent.split('\n'), lineCount: UIDContent.split('\n').length });
    }
  }, [UIDContent]);
  useEffect(() => {
    if (textContent.length) {
      setValues({ ...values, text: textContent.split('\n') });
    }
  }, [textContent]);

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

  const changePostPerUserStart = (post) => {
    setValues({ ...values, postStart: parseToNumber(post) });
  };

  const changePostPerUserEnd = (post) => {
    setValues({ ...values, postEnd: parseToNumber(post) });
  };

  const changeLike = (value) => {
    setValues({ ...values, isLiked: value });
  };
  const changeLikeStart = (like) => {
    setValues({ ...values, likeStart: parseToNumber(like) });
  };
  const changeLikeEnd = (like) => {
    setValues({ ...values, likeEnd: parseToNumber(like) });
  };

  const changeShare = (value) => {
    setValues({ ...values, isShare: value });
  };
  const changeShareStart = (share) => {
    setValues({ ...values, shareStart: parseToNumber(share) });
  };
  const changeShareEnd = (share) => {
    setValues({ ...values, shareEnd: parseToNumber(share) });
  };

  const changeComment = (value) => {
    setValues({ ...values, isComment: value });
  };
  const changeCommentStart = (comment) => {
    setValues({ ...values, commentStart: parseToNumber(comment) });
  };
  const changeCommentEnd = (comment) => {
    setValues({ ...values, commentEnd: parseToNumber(comment) });
  };
  const changeText = (value) => {
    setValues({ ...values, isText: value });
  };

  const handleDivUIDClick = () => {
    document.getElementById('UID').focus();
  };

  const handleDivCommentClick = () => {
    document.getElementById('Comment').focus();
  };

  const hightlightWithLineNumbers = (input, language, content) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${content ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <div className="Post_Interaction">
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
              <p>Post interaction</p>
            </div>
            <div className="PostUIDList">
              <p className="selectComment__header">
                Post UID list
                <span>({values.lineCount})</span>
              </p>
              <div className="component-item" style={{ position: 'relative' }}>
                <div className=" text" style={{ width: '100%', height: 204, overflow: 'auto' }}>
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
                </div>
                <div onClick={handleDivUIDClick} className={`placeholder ${UIDContent ? 'hide' : ''}`}>
                  <p>
                    <span>1</span>Enter the content here
                  </p>
                  <p>
                    <span>2</span>Each UID | Post UID list per line
                  </p>
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
                Delay time<span style={{ marginLeft: '1px' }}> (s):</span>
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

            <div className="component-item numberPostOrUser">
              <p className="component-item__header">Number of posts:</p>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changePostPerUserStart(values.postStart + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changePostPerUserStart(values.postStart - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="Start"
                  value={values.postStart}
                  onChange={(event) => changePostPerUserStart(event.target.value)}
                />
              </div>
              <span>to</span>
              <div className="component-item__number">
                <div className="component-item__number__icon">
                  <img
                    src={iconIncrease}
                    alt="Increase icon"
                    onClick={() => {
                      changePostPerUserEnd(values.postEnd + 1);
                    }}
                  />
                  <img
                    src={iconDecrease}
                    alt="Decrease icon"
                    onClick={() => {
                      changePostPerUserEnd(values.postEnd - 1);
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="End"
                  value={values.postEnd}
                  onChange={(event) => changePostPerUserEnd(event.target.value)}
                />
              </div>
            </div>

            <div className="component-item Like">
              <div className="component-item__header">
                <input
                  type="checkbox"
                  name="randomLike"
                  checked={values.isLiked}
                  onChange={(event) => changeLike(event.target.checked)}
                />
                <p>
                  Random Like{' '}
                  <span style={{ marginLeft: '2px' }} className={`span__content ${values.isLiked ? 'show' : 'hide'}`}>
                    (post)
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
                    value={values.likeStart}
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
                    value={values.likeEnd}
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
                  onChange={(event) => changeShare(event.target.checked)}
                />
                <p>
                  Share to Feed{' '}
                  <span style={{ marginLeft: '2px' }} className={`span__content ${values.isShare ? 'show' : 'hide'}`}>
                    (post)
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
                      onClick={() => {
                        changeShareStart(values.shareStart + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeShareStart(values.shareStart - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="Start"
                    value={values.shareStart}
                    onChange={(event) => changeShareStart(event.target.value)}
                  />
                </div>
                <span>to</span>
                <div className="component-item__number">
                  <div className="component-item__number__icon">
                    <img
                      src={iconIncrease}
                      alt="Increase icon"
                      onClick={() => {
                        changeShareEnd(values.shareEnd + 1);
                      }}
                    />
                    <img
                      src={iconDecrease}
                      alt="Decrease icon"
                      onClick={() => {
                        changeShareEnd(values.shareEnd - 1);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    name="End"
                    value={values.shareEnd}
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
                  onChange={(event) => changeComment(event.target.checked)}
                />
                <p>Randomly Comment</p>
              </div>
              <div className={`commentContent ${values.isComment ? 'show' : 'hide'}`}>
                <div className="component-item comment__numberPost">
                  <p className="component-item__header">Number of posts:</p>
                  <div className="component-item__content">
                    <div className="component-item__number">
                      <div className="component-item__number__icon">
                        <img
                          src={iconIncrease}
                          alt="Increase icon"
                          onClick={() => changeCommentStart(values.commentStart + 1)}
                        />
                        <img
                          src={iconDecrease}
                          alt="Decrease icon"
                          onClick={() => changeCommentStart(values.commentStart - 1)}
                        />
                      </div>
                      <input
                        type="text"
                        value={values.commentStart}
                        onChange={(event) => changeCommentStart(event.target.value)}
                      />
                    </div>

                    <span>to</span>

                    <div className="component-item__number">
                      <div className="component-item__number__icon">
                        <img
                          src={iconIncrease}
                          alt="Increase icon"
                          onClick={() => changeCommentEnd(values.commentEnd + 1)}
                        />
                        <img
                          src={iconDecrease}
                          alt="Decrease icon"
                          onClick={() => changeCommentEnd(values.commentEnd - 1)}
                        />
                      </div>
                      <input
                        type="text"
                        value={values.commentEnd}
                        onChange={(event) => changeCommentEnd(event.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="Text">
                  <div className="component-item__header">
                    <input
                      type="checkbox"
                      name="randomLike"
                      checked={values.isText}
                      onChange={(event) => changeText(event.target.checked)}
                    />
                    <p>Text</p>
                  </div>

                  <div
                    style={{ position: 'relative' }}
                    className={`component-item  ${values.isText ? 'show' : 'hide'}`}
                  >
                    <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                      <Editor
                        value={textContent}
                        onValueChange={(text) => setTextContent(text)}
                        highlight={(text) => hightlightWithLineNumbers(text, languages.js, textContent)}
                        padding={15}
                        className="editor"
                        textareaId="Comment"
                        style={{
                          background: '#f5f5f5',
                          fontSize: 15,
                        }}
                      />
                    </div>
                    <div onClick={handleDivCommentClick} className={`placeholder ${textContent ? 'hide' : ''}`}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post_Interaction;
