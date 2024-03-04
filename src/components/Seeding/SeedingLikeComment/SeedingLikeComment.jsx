import React, { useEffect, useState } from 'react';
import up from '../../../assets/pictures/icon-Increase.svg';
import down from '../../../assets/pictures/icon-Descrease.svg';
import drag from '../../../assets/pictures/icon-drag.svg';
import deleted from '../../../assets/pictures/icon-delete.svg';
import back from '../../../assets/icon/icon-back.svg';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import './style.scss';
import DefaultSciptSettings from '../../../resources/defaultSciptSettings.json';
import { useDropzone } from 'react-dropzone';

const SeedingLikeComment = ({ onGoBackClick, id, currentSetup, component, updateDesignScript }) => {
  const [likeComment, setLikeComment] = useState(DefaultSciptSettings['likeComment']);
  const [textComment, setTextComment] = useState('');
  const [UIDPost, setUIDPost] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [line, setLine] = useState(0);

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
      setLikeComment({ ...likeComment, file: [...likeComment.file, ...newFiles] });
    },
  });

  const handleDeleteButtonClick = () => {
    setLikeComment({ ...likeComment, file: [] });
  };

  useEffect(() => {
    if (currentSetup) {
      if (currentSetup.postID && currentSetup.postID.length) {
        setUIDPost(currentSetup.postID.join('\n'));
      }
      if (currentSetup.textComment && currentSetup.textComment.length) {
        setTextComment(currentSetup.textComment.join('\n'));
      }
      setLikeComment(currentSetup);
    }
  }, [currentSetup]);

  useEffect(() => {
    updateDesignScript(likeComment, component, id);
  }, [likeComment]);

  useEffect(() => {
    if (textComment.length) {
      setLikeComment({ ...likeComment, textComment: textComment.split('\n') });
    }
  }, [textComment]);

  useEffect(() => {
    if (UIDPost.length) {
      setLikeComment({ ...likeComment, postID: UIDPost.split('\n') });
    }
  }, [UIDPost]);

  useEffect(() => {
    // Kiểm tra xem có file được chọn không và chưa thực hiện hiển thị
    if (selectedFile && !isFileSelected) {
      setIsFileSelected(true);
    }
  }, [selectedFile, isFileSelected]);

  const hightlightWithLineNumbers = (input, language, value) =>
    highlight(input, language)
      .split('\n')
      .map((line, i) => `<span class='editorLineNumber ${value ? '' : 'hide'}'>${i + 1}</span>${line}`)
      .join('\n');

  //Post ID
  const handleWritePostID = () => {
    document.getElementById('postID').focus();
  };
  const onChangeLine = (e) => {
    const lines = e.target.value.split('\n');
    setLikeComment({ ...likeComment, line: lines.length });
  };
  const handleOnchangePostID = (value) => {
    setUIDPost(value);
  };
  //Text comment
  const handleWriteText = () => {
    document.getElementById('textComment').focus();
  };
  const handleOnchangeText = (value) => {
    setTextComment(value);
  };
  //like
  const changeLike = (value) => {
    setLikeComment({ ...likeComment, isLike: value });
  };

  // const handleLikeStart = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       likeStart: likeComment.likeStart + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       likeStart: likeComment.likeStart > 0 ? likeComment.likeStart - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeLikeStart = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };

  // const handleLikeEnd = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       likeEnd: likeComment.likeEnd + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       likeEnd: likeComment.likeEnd > 0 ? likeComment.likeEnd - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeLikeEnd = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };
  //share to feed
  const changeShare = (value) => {
    setLikeComment({ ...likeComment, isShare: value });
  };

  // const handleShareToFeedStart = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       shareToFeedStart: likeComment.shareToFeedStart + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       shareToFeedStart: likeComment.shareToFeedStart > 0 ? likeComment.shareToFeedStart - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeShareToFeedStart = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };
  // const handleShareToFeedEnd = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       shareToFeedEnd: likeComment.shareToFeedEnd + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       shareToFeedEnd: likeComment.shareToFeedEnd > 0 ? likeComment.shareToFeedEnd - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeShareToFeedEnd = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };
  //Post view time
  const handleViewTimeStart = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        viewTimeStart: likeComment.viewTimeStart + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        viewTimeStart: likeComment.viewTimeStart > 0 ? likeComment.viewTimeStart - 1 : 0,
      });
    }
  };
  const onChangeViewTimeStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  const handleViewTimeEnd = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        viewTimeEnd: likeComment.viewTimeEnd + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        viewTimeEnd: likeComment.viewTimeEnd > 0 ? likeComment.viewTimeEnd - 1 : 0,
      });
    }
  };
  const onChangeViewTimeEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };
  //delay time
  const handleDelayTimeStart = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        delayTimeStart: likeComment.delayTimeStart + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        delayTimeStart: likeComment.delayTimeStart > 0 ? likeComment.delayTimeStart - 1 : 0,
      });
    }
  };
  const onChangeDelayTimeStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  const handleDelayTimeEnd = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        delayTimeEnd: likeComment.delayTimeEnd + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        delayTimeEnd: likeComment.delayTimeEnd > 0 ? likeComment.delayTimeEnd - 1 : 0,
      });
    }
  };
  const onChangeDelayTimeEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };
  //post quantity
  const handlePostQuantityStart = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        postQuantityStart: likeComment.postQuantityStart + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        postQuantityStart: likeComment.postQuantityStart > 0 ? likeComment.postQuantityStart - 1 : 0,
      });
    }
  };
  const onChangePostQuantityStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  const handlePostQuantityEnd = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        postQuantityEnd: likeComment.postQuantityEnd + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        postQuantityEnd: likeComment.postQuantityEnd > 0 ? likeComment.postQuantityEnd - 1 : 0,
      });
    }
  };
  const onChangePostQuantityEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  //comment
  // const handleCommentStart = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       commentStart: likeComment.commentStart + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       commentStart: likeComment.commentStart > 0 ? likeComment.commentStart - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeCommentStart = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };

  // const handleCommentEnd = (type) => {
  //   if (type === 'increase') {
  //     setLikeComment({
  //       ...likeComment,
  //       commentEnd: likeComment.commentEnd + 1,
  //     });
  //   } else {
  //     setLikeComment({
  //       ...likeComment,
  //       commentEnd: likeComment.commentEnd > 0 ? likeComment.commentEnd - 1 : 0,
  //     });
  //   }
  // };
  // const onChangeCommentEnd = (e) => {
  //   const decimalRegex = /^[+-]?\d*\.?\d+$/;
  //   const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
  //   if (!isNaN(value) && decimalRegex.test(value)) {
  //     setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
  //   }
  // };

  //post quantity
  const changeComment = (value) => {
    setLikeComment({ ...likeComment, isComment: value });
  };
  const handlePhotoVideoStart = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        photoVideoQuantityStart: likeComment.photoVideoQuantityStart + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        photoVideoQuantityStart: likeComment.photoVideoQuantityStart > 0 ? likeComment.photoVideoQuantityStart - 1 : 0,
      });
    }
  };
  const onChangePhotoVideoStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  const handlePhotoVideoEnd = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        photoVideoQuantityEnd: likeComment.photoVideoQuantityEnd + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        photoVideoQuantityEnd: likeComment.photoVideoQuantityEnd > 0 ? likeComment.photoVideoQuantityEnd - 1 : 0,
      });
    }
  };
  const onChangePhotoVideoEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  //tag friend
  const changeTag = (value) => {
    setLikeComment({ ...likeComment, isTag: value });
  };
  const handleTagFriendStart = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        tagFriendStart: likeComment.tagFriendStart + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        tagFriendStart: likeComment.tagFriendStart > 0 ? likeComment.tagFriendStart - 1 : 0,
      });
    }
  };
  const onChangeTagFriendStart = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };

  const handleTagFriendEnd = (type) => {
    if (type === 'increase') {
      setLikeComment({
        ...likeComment,
        tagFriendEnd: likeComment.tagFriendEnd + 1,
      });
    } else {
      setLikeComment({
        ...likeComment,
        tagFriendEnd: likeComment.tagFriendEnd > 0 ? likeComment.tagFriendEnd - 1 : 0,
      });
    }
  };
  const onChangeTagFriendEnd = (e) => {
    const decimalRegex = /^[+-]?\d*\.?\d+$/;
    const value = e.target.value && e.target.value !== '' ? e.target.value : 0;
    if (!isNaN(value) && decimalRegex.test(value)) {
      setLikeComment({ ...likeComment, [e.target.name]: parseInt(value) });
    }
  };
  return (
    <div className="-layout-component">
      <div className="-seeding-like">
        <div className="scrollable-container">
          <div className="-seeding-wrapper-like">
            <div className="-back-home">
              <img src={back} alt="Back button" onClick={() => onGoBackClick(likeComment, component, id)} />
              <p>Boost like, comment</p>
            </div>
            <div className="-option-boost-like">
              <p>
                Post view time <span>(s)</span>:
              </p>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleViewTimeStart('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleViewTimeStart('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="viewTimeStart"
                  value={likeComment.viewTimeStart}
                  onChange={onChangeViewTimeStart}
                />
              </div>
              <span>to</span>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleViewTimeEnd('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleViewTimeEnd('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input type="text" name="viewTimeEnd" value={likeComment.viewTimeEnd} onChange={onChangeViewTimeEnd} />
              </div>
            </div>
            <div className="-option-boost-like">
              <p>
                Delay time <span>(s)</span>:
              </p>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleDelayTimeStart('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleDelayTimeStart('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="delayTimeStart"
                  value={likeComment.delayTimeStart}
                  onChange={onChangeDelayTimeStart}
                />
              </div>
              <span>to</span>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handleDelayTimeEnd('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handleDelayTimeEnd('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="delayTimeEnd"
                  value={likeComment.delayTimeEnd}
                  onChange={onChangeDelayTimeEnd}
                />
              </div>
            </div>
            <div className="-option-boost-like">
              <p>
                Post quantity<span>/account</span>:
              </p>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handlePostQuantityStart('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handlePostQuantityStart('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="postQuantityStart"
                  value={likeComment.postQuantityStart}
                  onChange={onChangePostQuantityStart}
                />
              </div>
              <span>to</span>
              <div className="-option-boost-like__number">
                <div className="-option-boost-like__number__icon">
                  <div style={{ marginBottom: '2px' }} onClick={() => handlePostQuantityEnd('increase')}>
                    <img src={up} alt="up" width={10} height={7} />
                  </div>
                  <div style={{ marginTop: '2px' }} onClick={() => handlePostQuantityEnd('des')}>
                    <img src={down} alt="down" width={10} height={7} />
                  </div>
                </div>
                <input
                  type="text"
                  name="postQuantityEnd"
                  value={likeComment.postQuantityEnd}
                  onChange={onChangePostQuantityEnd}
                />
              </div>
            </div>
            <div className="-option-boost-like -option-boost-comment">
              <p style={{ width: '100%' }}>
                Post ID: <span style={{ float: 'inline-end' }}>({likeComment.line})</span>
              </p>
              <div className="-option-boost-comment__wrapper">
                <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                  <Editor
                    value={UIDPost}
                    onValueChange={handleOnchangePostID}
                    onChange={onChangeLine}
                    highlight={(textContent) => hightlightWithLineNumbers(textContent, languages.js, UIDPost)}
                    padding={15}
                    className="editor"
                    textareaId="postID"
                    style={{
                      background: '#f5f5f5',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div
                  className="-option-boost-comment__wrapper__content"
                  onClick={handleWritePostID}
                  style={{ display: UIDPost ? 'none' : 'inline' }}
                >
                  <p style={{ width: '51%' }}>
                    <span>1</span>
                    <div>Enter the UID|Post UID here</div>
                  </p>
                  <p>
                    <span>2</span>
                    <div>Each UID|Post UID/line</div>
                  </p>
                </div>
              </div>
            </div>
            <div className="-option-boost-like">
              <div className="-option-boost-like__header">
                <input
                  type="checkbox"
                  name="isLike"
                  checked={likeComment.isLike}
                  onChange={(event) => changeLike(event.target.checked)}
                />
                <p>Like</p>
              </div>
              {/* <div
                className="-option-boost-like__header__content"
                style={{ display: likeComment.isLike ? 'flex' : 'none' }}
              >
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleLikeStart('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleLikeStart('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input type="text" name="likeStart" value={likeComment.likeStart} onChange={onChangeLikeStart} />
                </div>
                <span>to</span>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleLikeEnd('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleLikeEnd('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input type="text" name="likeEnd" value={likeComment.likeEnd} onChange={onChangeLikeEnd} />
                </div>
              </div> */}
            </div>
            <div className="-option-boost-like">
              <div className="-option-boost-like__header">
                <input
                  type="checkbox"
                  name="isShare"
                  checked={likeComment.isShare}
                  onChange={(event) => changeShare(event.target.checked)}
                />
                <p>Share to Feed</p>
              </div>
              {/* <div
                className="-option-boost-like__header__content"
                style={{ display: likeComment.isShare ? 'flex' : 'none' }}
              >
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleShareToFeedStart('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleShareToFeedStart('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="shareToFeedStart"
                    value={likeComment.shareToFeedStart}
                    onChange={onChangeShareToFeedStart}
                  />
                </div>
                <span>to</span>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleShareToFeedEnd('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleShareToFeedEnd('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="shareToFeedEnd"
                    value={likeComment.shareToFeedEnd}
                    onChange={onChangeShareToFeedEnd}
                  />
                </div>
              </div> */}
            </div>
            <div className="-option-boost-like">
              <div className="-option-boost-like__header">
                <input
                  type="checkbox"
                  name="isComment"
                  checked={likeComment.isComment}
                  onChange={(event) => changeComment(event.target.checked)}
                />
                <p>Comment</p>
              </div>
              {/* <div
                className="-option-boost-like__header__content"
                style={{ display: likeComment.isComment ? 'flex' : 'none' }}
              >
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleCommentStart('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleCommentStart('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="commentStart"
                    value={likeComment.commentStart}
                    onChange={onChangeCommentStart}
                  />
                </div>
                <span>to</span>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleCommentEnd('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleCommentEnd('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input type="text" name="commentEnd" value={likeComment.commentEnd} onChange={onChangeCommentEnd} />
                </div>
              </div> */}
            </div>
            <div
              className="-option-boost-like -option-boost-comment"
              style={{ display: likeComment.isComment ? 'block' : 'none' }}
            >
              <p>Text</p>
              <div className="-option-boost-comment__wrapper">
                <div style={{ width: '100%', height: 204, overflow: 'auto' }} className="text">
                  <Editor
                    value={textComment}
                    onValueChange={handleOnchangeText}
                    highlight={(textContent) => hightlightWithLineNumbers(textContent, languages.js, textComment)}
                    padding={15}
                    className="editor"
                    textareaId="textComment"
                    style={{
                      background: '#f5f5f5',
                      fontSize: 15,
                    }}
                  />
                </div>
                <div
                  className="-option-boost-comment__wrapper__content"
                  onClick={handleWriteText}
                  style={{ display: textComment ? 'none' : 'inline' }}
                >
                  <p>
                    <span>1</span>
                    <div>Enter the content here</div>
                  </p>
                  <p>
                    <span>2</span>
                    <div>Each content/line</div>
                  </p>
                </div>
              </div>
            </div>
            <div
              className="-option-boost-like -option-photo-video"
              style={{ display: likeComment.isComment ? 'block' : 'none' }}
            >
              <h1>Photo/Video</h1>
              {/* <div className="-option-boost-like">
                <p>Quantity:</p>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handlePhotoVideoStart('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handlePhotoVideoStart('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="photoVideoQuantityStart"
                    value={likeComment.photoVideoQuantityStart}
                    onChange={onChangePhotoVideoStart}
                  />
                </div>
                <span>to</span>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handlePhotoVideoEnd('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handlePhotoVideoEnd('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="photoVideoQuantityEnd"
                    value={likeComment.photoVideoQuantityEnd}
                    onChange={onChangePhotoVideoEnd}
                  />
                </div>
              </div> */}
            </div>
            {/* <div className="-option-boost-like dragVideoOrPhoto" onClick={handleFile}> */}
            <div
              {...getRootProps({ className: '-option-boost-like dragVideoOrPhoto' })}
              style={{ display: likeComment.isComment ? 'flex' : 'none' }}
            >
              <img src={drag} alt="icon-drag" />
              <span>Drag the photo/video folder here</span>
              <input {...getInputProps()} />
            </div>
            {likeComment.file.length > 0 && likeComment.isComment && (
              <div className="folderPhoto">
                <p>
                  <span>Folder:</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {likeComment.file.map((filePath, index) => (
                      <span key={index}>{filePath.replace(/^.*[\\/]/, '')}</span>
                    ))}
                  </div>
                </p>
                <img src={deleted} alt="icon-delete" onClick={handleDeleteButtonClick} />
              </div>
            )}

            <div className="-option-boost-like -option-photo-video">
              <div className="-option-photo-video__checkbox">
                <input
                  type="checkbox"
                  name="isTag"
                  checked={likeComment.isTag}
                  onChange={(event) => changeTag(event.target.checked)}
                />
                <h1>Tag friends</h1>
              </div>
              <div className="-option-boost-like" style={{ display: likeComment.isTag ? 'flex' : 'none' }}>
                <p>Number of friends:</p>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleTagFriendStart('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleTagFriendStart('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="tagFriendStart"
                    value={likeComment.tagFriendStart}
                    onChange={onChangeTagFriendStart}
                  />
                </div>
                <span>to</span>
                <div className="-option-boost-like__number">
                  <div className="-option-boost-like__number__icon">
                    <div style={{ marginBottom: '2px' }} onClick={() => handleTagFriendEnd('increase')}>
                      <img src={up} alt="up" width={10} height={7} />
                    </div>
                    <div style={{ marginTop: '2px' }} onClick={() => handleTagFriendEnd('des')}>
                      <img src={down} alt="down" width={10} height={7} />
                    </div>
                  </div>
                  <input
                    type="text"
                    name="tagFriendEnd"
                    value={likeComment.tagFriendEnd}
                    onChange={onChangeTagFriendEnd}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedingLikeComment;
