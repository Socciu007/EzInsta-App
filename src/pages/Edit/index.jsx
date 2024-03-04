import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import DnDFlow from '../../components/drag/drag';
import WatchStory from '../../components/General/WatchStory/WatchStory.jsx';
import WatchVideo from '../../components/General/WatchVideo/WatchVideo.jsx';
import CancelFriend from '../../components/General/Cancel_Friend/CancelFriend.jsx';
import Newsfeed from '../../components/General/Newsfeed/Newsfeed.jsx';
import CreatePost from '../../components/General/CreatePost/CreatePost.jsx';
import Post_Interaction from '../../components/General/Post_Interaction/Post_Interaction.jsx';
import Delete_Post from '../../components/General/Delete_Post/Delete_Post.jsx';
import View_Notifications from '../../components/General/View_Notifications/View_Notifications.jsx';
import Send_Message from '../../components/General/Send_Message/Send_Message.jsx';
import Reply_Message from '../../components/General/Reply_Message/Reply_Message.jsx';
import AddFriend from '../../components/General/Add_Friends/AddFriend.jsx';
import JoinGroup from '../../components/Group/Join_Group/JoinGroup.jsx';
import LeaveGroup from '../../components/Group/Leave_Group/LeaveGroup.jsx';
import Invite from '../../components/Group/Invite/Invite.jsx';
import SeedingLikeComment from '../../components/Seeding/SeedingLikeComment/SeedingLikeComment.jsx';
import SeedingFollower from '../../components/Seeding/SeedingFollower/SeedingFollower.jsx';
import SeedingView from '../../components/Seeding/SeedingView/SeedingView.jsx';

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
import createPost from '../../assets/icon/icon-createPostGeneral.svg';
import postInteract from '../../assets/icon/icon-postInteractGeneral.svg';
import deletePost from '../../assets/icon/icon-deletePostGeneral.svg';
import viewNoti from '../../assets/icon/icon-viewNotiGeneral.svg';
import sendMsg from '../../assets/icon/icon-sendMsgGeneral.svg';
import reply from '../../assets/icon/icon-replyGeneral.svg';
import addFriend from '../../assets/icon/icon-addFriendGeneral.svg';
import cancel from '../../assets/icon/icon-cancelGeneral.svg';
import joinGroup from '../../assets/icon/icon-joinGroup.svg';
import leftGroup from '../../assets/icon/icon-leftGroup.svg';
import invite from '../../assets/icon/icon-inviteGroup.svg';
import likeComment from '../../assets/icon/icon-likeComment.svg';
import follower from '../../assets/icon/icon-follower.svg';
import viewVideo from '../../assets/icon/icon-viewVideo.svg';
import CreatePostGroup from '../../components/Group/Create_Post/CreatePost.jsx';

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
      case 'joinGroup':
        return <JoinGroup onGoBackClick={handleGoBackClick} />;
      case 'leftGroup':
        return <LeaveGroup onGoBackClick={handleGoBackClick} />;
      case 'inviteGroup':
        return <Invite onGoBackClick={handleGoBackClick} />;
      case 'createPostGroup':
        return <CreatePostGroup onGoBackClick={handleGoBackClick} />;
      case 'likeComment':
        return <SeedingLikeComment onGoBackClick={handleGoBackClick} />;
      case 'follower':
        return <SeedingFollower onGoBackClick={handleGoBackClick} />;
      case 'viewVideo':
        return <SeedingView onGoBackClick={handleGoBackClick} />;
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
                  Group
                </button>
                <button
                  className={activeCategory === 3 ? 'categoryActive' : 'categoryBtn'}
                  onClick={() => handleCategoryClick(3)}
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
                  <div className="card" onDragStart={(event) => onDragStart(event, 'joinGroup')} draggable>
                    <img src={joinGroup} alt="join Group General" />
                    <p>Join group</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'leftGroup')} draggable>
                    <img src={leftGroup} alt="left Group General" />
                    <p>Left group</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'inviteGroup')} draggable>
                    <img src={invite} alt="invite Group General" />
                    <p>Invite</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'createPostGroup')} draggable>
                    <img src={createPost} alt="watch newsfeed General" />
                    <p>Create post</p>
                  </div>
                </div>
                <div className={activeCategory === 3 ? 'grid-container' : 'hide'}>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'likeComment')} draggable>
                    <img src={likeComment} alt="Like and Comment" />
                    <p>Like, comment</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'follower')} draggable>
                    <img src={follower} alt="Followers" />
                    <p>Followers</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'viewVideo')} draggable>
                    <img src={viewVideo} alt="View Video" />
                    <p>View video</p>
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
            <h1>FACEBOOK AUTOMATION</h1>
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
