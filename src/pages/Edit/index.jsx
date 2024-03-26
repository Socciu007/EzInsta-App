import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import DnDFlow from '../../components/drag/drag';
import WatchStory from '../../components/General/WatchStory/WatchStory.jsx';
import WatchVideo from '../../components/General/WatchVideo/WatchVideo.jsx';
import Newsfeed from '../../components/General/Newsfeed/Newsfeed.jsx';
import CreatePost from '../../components/General/CreatePost/CreatePost.jsx';
import Delete_Post from '../../components/General/Delete_Post/Delete_Post.jsx';
import View_Notifications from '../../components/General/View_Notifications/View_Notifications.jsx';
import DirectMsg from '../../components/Group/DirectMsg/DirectMsg.jsx';
import PostInteraction from '../../components/Group/PostInteraction/PostInteraction.jsx';
import UnFollow from '../../components/Group/UnFollow/UnFollow.jsx';
import Follow from '../../components/Group/Follow/Follow.jsx';
import HashtagInteraction from '../../components/General/Hashtag_Interaction/HashtagInteraction.jsx';
import search from '../../assets/icon/icon-search.svg';
import back from '../../assets/icon/icon-back.svg';
import newNote from '../../assets/icon/icon-newNote.svg';
import debug from '../../assets/icon/icon-debug.svg';
import runTest from '../../assets/icon/icon-runTest.svg';
import option from '../../assets/icon/icon-options.svg';
import save from '../../assets/icon/icon-save.svg';
import watchStory from '../../assets/icon/icon-watchStoryGeneral.svg';
import watchVideo from '../../assets/icon/icon-watchVideoGeneral.svg';
import newsfeed from '../../assets/icon/icon-newsfeedGeneral.svg';
import follow from '../../assets/icon/icon-follow.svg';
import postInteract from '../../assets/icon/icon-postInteractGeneral.svg';
import deletePost from '../../assets/icon/icon-deletePostGeneral.svg';
import viewNoti from '../../assets/icon/icon-viewNotiGeneral.svg';
import sendMsg from '../../assets/icon/icon-sendMsgGeneral.svg';
import reply from '../../assets/icon/icon-replyGeneral.svg';
import addFriend from '../../assets/icon/icon-addFriendGeneral.svg';
import cancel from '../../assets/icon/icon-cancelGeneral.svg';
import postInteraction from '../../assets/icon/icon-postInteraction.svg';
import directMsg from '../../assets/icon/icon-directMsg.svg';
import unFollow from '../../assets/icon/icon-unfollow.svg';

const Edit = () => {
  const [component, setComponent] = useState('default');
  const handleMessageChange = (event) => {
    setComponent(event);
  };

  const [messageClickBack, setMessageClickBack] = useState(false);

  const handleGoBackClick = () => {
    setComponent('default');
  };

  const [activeCategory, setActiveCategory] = useState(1);
  const navigate = useNavigate();
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const handleReturnClick = () => {
    // Navigate to the desired route when the button is clicked
    navigate('/scripManager');
  };
  const handleCategoryClick = (categoryNumber) => {
    setActiveCategory(categoryNumber === activeCategory ? null : categoryNumber);
  };

  const renderComponent = (id) => {
    switch (id) {
      case 'watchStory':
        return <WatchStory onGoBackClick={handleGoBackClick} />;
      case 'watchVideo':
        return <WatchVideo onGoBackClick={handleGoBackClick} />;
      case 'newsFeed':
        return <Newsfeed onGoBackClick={handleGoBackClick} />;
      case 'createPost':
        return <CreatePost onGoBackClick={handleGoBackClick} />;
      case 'postInteract':
        return <Post_Interaction onGoBackClick={handleGoBackClick} />;
      case 'deletePost':
        return <Delete_Post onGoBackClick={handleGoBackClick} />;
      case 'viewNoti':
        return <View_Notifications onGoBackClick={handleGoBackClick} />;
      case 'sendMsg':
        return <Send_Message onGoBackClick={handleGoBackClick} />;
      case 'replyMsg':
        return <Reply_Message onGoBackClick={handleGoBackClick} />;
      case 'addFriend':
        return <AddFriend onGoBackClick={handleGoBackClick} />;
      case 'cancelFriend':
        return <CancelFriend onGoBackClick={handleGoBackClick} />;
      case 'seedingPost':
        return <PostInteraction onGoBackClick={handleGoBackClick} />;
      case 'directMsg':
        return <DirectMsg onGoBackClick={handleGoBackClick} />;
      case 'unfollow':
        return <UnFollow onGoBackClick={handleGoBackClick} />;
      case 'follow':
        return <Follow onGoBackClick={handleGoBackClick} />;

      default:
        return (
          <div className={messageClickBack ? 'hide' : 'scrollable-container'}>
            <div className="left-content">
              <div className="left-content__top">
                <div className="search">
                  <img src={search} alt="Icon-search" />
                  <input className="inputSearch" placeholder="Search..."></input>
                </div>
              </div>
              <div className="left-content__category">
                <button
                  className={activeCategory === 1 ? 'categoryActive' : 'categoryBtn'}
                  onClick={() => handleCategoryClick(1)}
                >
                  General
                </button>
                <button
                  className={activeCategory === 2 ? 'categoryActive' : 'categoryBtn'}
                  onClick={() => handleCategoryClick(2)}
                >
                  Seeding
                </button>

                <hr />
              </div>
              <div className="left-content__container">
                <div className={activeCategory === 1 ? 'grid-container' : 'hide'}>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'watchStory')} draggable>
                    <img src={watchStory} alt="watch Story General" />
                    <p>Watch story</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'watchVideo')} draggable>
                    <img src={watchVideo} alt="watch Video General" />
                    <p>Watch video</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'newsFeed')} draggable>
                    <img src={newsfeed} alt="watch newsfeed General" />
                    <p>Newsfeed</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'createPost')} draggable>
                    <img src={createPost} alt="watch newsfeed General" />
                    <p>Create post</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'postInteract')} draggable>
                    <img src={postInteract} alt="watch newsfeed General" />
                    <p>Post interaction</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'deletePost')} draggable>
                    <img src={deletePost} alt="watch newsfeed General" />
                    <p>Delete post</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'viewNoti')} draggable>
                    <img src={viewNoti} alt="watch newsfeed General" />
                    <p>View notifications</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'sendMsg')} draggable>
                    <img src={sendMsg} alt="watch newsfeed General" />
                    <p>Send message</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'replyMsg')} draggable>
                    <img src={reply} alt="watch newsfeed General" />
                    <p>Reply message</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'addFriend')} draggable>
                    <img src={addFriend} alt="watch newsfeed General" />
                    <p>Add friend</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'cancelFriend')} draggable>
                    <img src={cancel} alt="watch newsfeed General" />
                    <p>Cancel friend</p>
                  </div>
                </div>
                <div className={activeCategory === 2 ? 'grid-container' : 'hide'}>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'seedingPost')} draggable>
                    <img src={postInteraction} alt="post interaction" />
                    <p>Post interaction</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'directMsg')} draggable>
                    <img src={directMsg} alt="directMsg" />
                    <p>Direct Message</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'unfollow')} draggable>
                    <img src={unFollow} alt="unfollow" />
                    <p>Unfollow</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'follow')} draggable>
                    <img src={follow} alt="follow" />
                    <p>Follow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="edit">
          <div className="script-manager__header">
            <h1>EzInsta</h1>
            <div className="title">
              <button onClick={handleReturnClick}>
                <img src={back} alt="Return" />
              </button>
              <p>Edit</p>
            </div>
          </div>
          <div className="create-script__content">
            {renderComponent(component)}

            <div className="right-content">
              <div className="right-content__edit">
                <div className="edit-input">
                  <input type="text" placeholder="Enter name" />
                </div>
                <div className="note-input">
                  <img src={newNote} alt="new Note" />
                  <input type="text" placeholder="New note" />
                </div>
                <div className="groupEndBtn">
                  <button className="debug">
                    <img src={debug} alt="Debug" />
                  </button>
                  <button className="test">
                    <img src={runTest} alt="Debug" />
                  </button>
                  <button className="more" style={{ display: 'none' }}>
                    <img src={option} alt="More" />
                  </button>
                  <button className="saveBtn">
                    <img src={save} alt="Save" />
                    SAVE
                  </button>
                </div>
              </div>
              <div className="right-content__container">
                <DnDFlow onMessageChange={handleMessageChange}></DnDFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
