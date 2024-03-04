import React, { useEffect, useState } from 'react';
import up from '../../../assets/pictures/icon-Increase.svg';
import down from '../../../assets/pictures/icon-Descrease.svg';
import back from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';

const SeedingView = ({ onGoBackClick, id, updateDesignScript, currentSetup, component }) => {
  const [videoView, setVideoView] = useState(DefaultSciptSettings['viewVideo']);
  const [UIDContent, setUIDContent] = useState('');
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.videoID && currentSetup.videoID.length) {
        setUIDContent(currentSetup.videoID.join('\n'));
      }

      setVideoView(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(videoView, component, id);
  }, [videoView]);

  useEffect(() => {
    if (UIDContent.length) {
      setVideoView({ ...videoView, videoID: UIDContent.split('\n') });
    }
  }, [UIDContent]);

  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${videoView.videoID ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');
  //
  const handleVideoViewTimeStart = (type) => {
    if (type === 'increase') {
      setVideoView({
        ...videoView,
        viewTimeStart: videoView.viewTimeStart + 1,
      });
    } else {
      setVideoView({
        ...videoView,
        viewTimeStart: videoView.viewTimeStart > 0 ? videoView.viewTimeStart - 1 : 0,
      });
    }
  };
  const onChangeVideoViewTimeStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setVideoView({ ...videoView, [e.target.name]: parseInt(value) });
    }
  };
  const handleVideoViewTimeEnd = (type) => {
    if (type === 'increase') {
      setVideoView({
        ...videoView,
        viewTimeEnd: videoView.viewTimeEnd + 1,
      });
    } else {
      setVideoView({
        ...videoView,
        viewTimeEnd: videoView.viewTimeEnd > 0 ? videoView.viewTimeEnd - 1 : 0,
      });
    }
  };
  const onChangeVideoViewTimeEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setVideoView({ ...videoView, [e.target.name]: parseInt(value) });
    }
  };

  const handleClickText = () => {
    document.getElementById('videoID').focus();
  };
  const onChangeLine = (e) => {
    const lines = e.target.value.split('\n');
    setVideoView({ ...videoView, line: lines.length });
  };
  const handleOnchangeVideoID = (value) => {
    setUIDContent(value);
  };

  return (
    <div className="-layout-component">
      <div className="-seeding-like">
        <div className="scrollable-container">
          <div className="-seeding-wrapper-like">
            <div className="-back-home">
              <img src={back} alt="Back Button" onClick={() => onGoBackClick(videoView, component, id)} />
              <p>Boost video view</p>
            </div>
            <div className="-option-boost-like">
              <p>
                Video view time <span>(s)</span>:
              </p>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleVideoViewTimeStart('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleVideoViewTimeStart('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="viewTimeStart"
                  value={videoView.viewTimeStart}
                  onChange={onChangeVideoViewTimeStart}
                />
              </div>
              <span>to</span>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleVideoViewTimeEnd('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleVideoViewTimeEnd('increase')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="viewTimeEnd"
                  value={videoView.viewTimeEnd}
                  onChange={onChangeVideoViewTimeEnd}
                />
              </div>
            </div>
            <div className="-option-boost-like -option-boost-comment">
              <p style={{ width: '100%' }}>
                Video ID: <span style={{ float: 'inline-end' }}>({videoView.line})</span>
              </p>
              <div className="-option-boost-comment__wrapper">
                <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                  <Editor
                    value={UIDContent}
                    onValueChange={handleOnchangeVideoID}
                    onChange={onChangeLine}
                    highlight={(textContent) => hightlightWithLineNumbers(textContent, languages.js, UIDContent)}
                    padding={15}
                    className="editor"
                    textareaId="videoID"
                    style={{
                      background: '#f5f5f5',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div
                  className="-option-boost-comment__wrapper__content"
                  onClick={handleClickText}
                  style={{ display: UIDContent ? 'none' : 'inline' }}
                >
                  <p style={{ width: '51%' }}>
                    <span>1</span>
                    <div>Enter the Video ID here</div>
                  </p>
                  <p>
                    <span>2</span>
                    <div>Each Video ID/line</div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedingView;
