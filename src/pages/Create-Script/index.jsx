import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './style.scss';
import { v4 as uuidv4 } from 'uuid';
import DnDFlow from '../../components/drag/drag';
import WatchStory from '../../components/General/WatchStory/WatchStory.jsx';
import Newsfeed from '../../components/General/Newsfeed/Newsfeed.jsx';
import CreatePost from '../../components/General/CreatePost/CreatePost.jsx';
import Delete_Post from '../../components/General/Delete_Post/Delete_Post.jsx';
import View_Notifications from '../../components/General/View_Notifications/View_Notifications.jsx';
import UnFollow from '../../components/Group/UnFollow/UnFollow.jsx';
import Follow from '../../components/Group/Follow/Follow.jsx';
import PostInteraction from '../../components/Group/PostInteraction/PostInteraction.jsx';
import DirectMsg from '../../components/Group/DirectMsg/DirectMsg.jsx';
import WatchVideo from '../../components/General/WatchVideo/WatchVideo.jsx';
import HashtagInteraction from '../../components/General/Hashtag_Interaction/HashtagInteraction.jsx';
import FollowInteraction from '../../components/General/Follow_Interaction/FollowInteraction.jsx';
import search from '../../assets/icon/icon-search.svg';
import back from '../../assets/icon/icon-back.svg';
import newNote from '../../assets/icon/icon-newNote.svg';
import debug from '../../assets/icon/icon-debug.svg';
import runTest from '../../assets/icon/icon-runTest.svg';
import save from '../../assets/icon/icon-save.svg';
import watchStory from '../../assets/icon/icon-watchStoryGeneral.svg';
import watchReel from '../../assets/icon/icon-watchReelGeneral.svg';
import newsfeed from '../../assets/icon/icon-newsfeedGeneral.svg';
import createPost from '../../assets/icon/icon-createPostGeneral.svg';
import follow from '../../assets/icon/icon-follow.svg';
import deletePost from '../../assets/icon/icon-deletePostGeneral.svg';
import viewNoti from '../../assets/icon/icon-viewNotiGeneral.svg';
import updateProfile from '../../assets/icon/icon-updateProfileGeneral.svg';
import heart from '../../assets/icon/icon-heartGeneral.svg';
import hashtag from '../../assets/icon/icon-hashtagGeneral.svg';
import postInteraction from '../../assets/icon/icon-postInteraction.svg';
import directMsg from '../../assets/icon/icon-directMsg.svg';
import rectangSelect from '../../assets/icon/img-rectangleRed.png';
import unFollow from '../../assets/icon/icon-unfollow.svg';
import { storageScripts } from '../../common/const.config.js';
import DefaultSciptSettings from '../../resources/defaultSciptSettings.json';
import { dbGetLocally, dbSetLocally } from '../../sender';
import { Store } from 'react-notifications-component';
import notification from '../../resources/notification.json';
import PopupChooseProfile from '../../components/PopupHome/PopupChooseProfile/PopupChooseProfile.jsx';
import PopupDebug from '../../components/PopupHome/PopupDebug/PopupDebug.jsx';
import { useSelector } from 'react-redux';
import UpdateProfile from '../../components/General/UpdateProfile/UpdateProfile.jsx';
const CreateScript = () => {
  const DnDFlowRef = useRef();
  const { state } = useLocation();
  const [component, setComponent] = useState('default');
  const [nameScript, setNameScript] = useState('');
  const [noteScript, setNoteScript] = useState('');
  const [designScript, setDesignScript] = useState(
    state
      ? state
      : {
          design: {},
          script: [],
        },
  );
  const [currentComponent, setCurrentComponent] = useState('');
  const [currentSetup, setCurrentSetup] = useState(null);
  const [activeCategory, setActiveCategory] = useState(1);
  const [openProfiles, setOpenProfiles] = useState(false);
  const [profileSelected, setProfileSelected] = useState(null);
  const navigate = useNavigate();
  const debugs = useSelector((state) => state.debug);

  useEffect(() => {
    setDefaultScript();
  }, [state]);

  const setDefaultScript = () => {
    if (state) {
      setNameScript(state.name ? state.name : '');
      setNoteScript(state.note ? state.note : '');
    }
  };

  const selectProfile = (profiles) => {
    setProfileSelected(profiles);
  };
  const handleMessageChange = (component, id) => {
    const setup = designScript.script.find((e) => e.id == id);

    if (setup) {
      setCurrentSetup(setup);
    }
    setCurrentComponent(id);
    setComponent(component);
  };

  const handleDeleteNode = (id) => {
    let newDesign = { ...designScript };
    newDesign.script = designScript.script.filter((e) => e.id !== id);
    setDesignScript(newDesign);
    setCurrentSetup(null);
    setComponent('default');
  };

  const handleGoBackClick = () => {
    setCurrentSetup(null);
    setComponent('default');
  };

  const updateDesignScript = (value, component, id) => {
    const newDesign = { ...designScript };
    const index = newDesign.script.findIndex((e) => e.id == id);
    if (index >= 0) {
      newDesign.script[index] = { ...value, id, type: component };
    } else {
      newDesign.script.push({ ...value, id, type: component });
    }
    setDesignScript(newDesign);
  };

  const onSave = async () => {
    if (nameScript !== '') {
      const design = DnDFlowRef.current.getReactFlowInstance();
      let arrScript = [];
      const scriptStr = await dbGetLocally(storageScripts);
      if (scriptStr && scriptStr.length) {
        const script = JSON.parse(scriptStr);
        if (script && script.length) {
          arrScript = [...script];
        }
      }

      const index = arrScript.findIndex((e) => e.id == designScript.id);
      if (index >= 0) {
        arrScript[index] = {
          ...designScript,
          design,
          name: nameScript,
          note: noteScript,
        };
      } else {
        arrScript.push({
          ...designScript,
          design,
          name: nameScript,
          note: noteScript,
          status: '',
          id: designScript.id ? designScript.id : uuidv4(),
          isPin: designScript.isPin ? true : false,
          createdAt: new Date(),
        });
        console.log('designScript', designScript);
      }

      const res = await dbSetLocally(storageScripts, JSON.stringify(arrScript));

      if (res) {
        Store.addNotification({
          ...notification,
          type: 'success',
          message: 'Script saved!',
        });
        handleReturnClick();
      } else {
        Store.addNotification({
          ...notification,
          type: 'danger',
          message: 'Save script fail!',
        });
      }
    } else {
      Store.addNotification({
        ...notification,
        type: 'warning',
        message: 'Enter name script!',
      });
    }
  };

  const onAddNewNode = (component, id) => {
    const setup = DefaultSciptSettings[component];
    if (setup) {
      const newDesign = { ...designScript };
      newDesign.script.push({ ...setup, id, type: component });
      setDesignScript(newDesign);
    }

    setTimeout(() => {
      console.log(designScript);
    }, 1000);
  };

  const handelChangeName = (value) => {
    setNameScript(value);
  };

  const handelChangeNote = (value) => {
    setNoteScript(value);
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleReturnClick = () => {
    navigate('/scripManager');
  };
  const handleCategoryClick = (categoryNumber) => {
    setActiveCategory(categoryNumber);
  };

  const renderComponent = (component) => {
    switch (component) {
      case 'watchStory':
        return (
          <WatchStory
            component={component}
            currentSetup={currentSetup}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );
      case 'watchVideo':
        return (
          <WatchVideo
            component={component}
            currentSetup={currentSetup}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );
      case 'newsFeed':
        return (
          <Newsfeed
            component={component}
            currentSetup={currentSetup}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );
      case 'createPost':
        return (
          <CreatePost
            currentSetup={currentSetup}
            component={component}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );

      case 'deletePost':
        return (
          <Delete_Post
            currentSetup={currentSetup}
            component={component}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );
      case 'viewNoti':
        return (
          <View_Notifications
            currentSetup={currentSetup}
            component={component}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
            updateDesignScript={updateDesignScript}
          />
        );
      case 'updateProfile':
        return (
          <UpdateProfile
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'followInteraction':
        return (
          <FollowInteraction
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'hashtagInteraction':
        return (
          <HashtagInteraction
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'seedingPost':
        return (
          <PostInteraction
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'directMsg':
        return (
          <DirectMsg
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'unfollow':
        return (
          <UnFollow
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      case 'follow':
        return (
          <Follow
            currentSetup={currentSetup}
            component={component}
            updateDesignScript={updateDesignScript}
            id={currentComponent}
            onGoBackClick={handleGoBackClick}
          />
        );
      default:
        return (
          <div className={'scrollable-container'}>
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
                  {activeCategory === 1 && <img src={rectangSelect} alt="img rectangle"></img>}
                  <p>General</p>
                </button>
                <button
                  className={activeCategory === 2 ? 'categoryActive' : 'categoryBtn'}
                  onClick={() => handleCategoryClick(2)}
                >
                  {activeCategory === 2 && <img src={rectangSelect} alt="img rectangle"></img>}
                  <p>Seeding</p>
                </button>

                <hr />
              </div>
              <div className="left-content__container">
                <div className={activeCategory === 1 ? 'grid-container' : 'hide'}>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'newsFeed')} draggable>
                    <img src={newsfeed} alt="Watch Newsfeed General" />

                    <p>Newsfeed</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'watchStory')} draggable>
                    <img src={watchStory} alt="Watch Story General" />
                    <p>Watch story</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'watchVideo')} draggable>
                    <img src={watchReel} alt="Watch Reels General" />
                    <p>Watch reels</p>
                  </div>

                  <div className="card" onDragStart={(event) => onDragStart(event, 'createPost')} draggable>
                    <img src={createPost} alt="watch newsfeed General" />
                    <p>Create post</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'deletePost')} draggable>
                    <img src={deletePost} alt="Delete Post General" />
                    <p>Delete post</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'viewNoti')} draggable>
                    <img src={viewNoti} alt="Notification General" />
                    <p>Notification</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'updateProfile')} draggable>
                    <img src={updateProfile} alt="Update Profile General" />
                    <p>Update Profile</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'followInteraction')} draggable>
                    <img src={heart} alt="Interact with follower/following General" />
                    <p style={{ textAlign: 'center' }}>Follow Interaction</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'hashtagInteraction')} draggable>
                    <img src={hashtag} alt="Hashtag Interaction General" />
                    <p style={{ textAlign: 'center' }}>Hashtag Interaction</p>
                  </div>
                </div>
                <div className={activeCategory === 2 ? 'grid-container' : 'hide'}>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'seedingPost')} draggable>
                    <img src={postInteraction} alt="postInteraction" />
                    <p>Post interaction</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'directMsg')} draggable>
                    <img src={directMsg} alt="directMsg" />
                    <p>Direct message</p>
                  </div>
                  <div className="card" onDragStart={(event) => onDragStart(event, 'unfollow')} draggable>
                    <img src={unFollow} alt="unFollow" />
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

  //profiles
  const handleOpenProfiles = () => {
    const design = DnDFlowRef.current.getReactFlowInstance();
    setDesignScript({ ...designScript, design });
    setOpenProfiles(true);
  };
  const handleCloseProfiles = () => {
    setOpenProfiles(false);
  };

  const [openDebug, setOpenDebug] = useState(false);
  //Debug
  const handleOpenDebug = () => {
    setOpenDebug(true);
  };
  const handleCloseDebug = () => {
    setOpenDebug(false);
  };

  return (
    <>
      <div className="wrapper">
        <div className="create-script">
          <div className="script-manager__header">
            <h1>INSTAGRAM TOOL</h1>
            <div className="title">
              <button onClick={handleReturnClick}>
                <img src={back} alt="Return" />
              </button>
              {state && state.id ? <p>Edit script</p> : <p>Create a new script</p>}
            </div>
          </div>
          <div className="create-script__content">
            {renderComponent(component)}
            <div className="right-content">
              <div className="right-content__edit">
                <div className="edit-input">
                  <input
                    type="text"
                    value={nameScript}
                    onChange={(event) => handelChangeName(event.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="note-input">
                  <img src={newNote} alt="new Note" />
                  <input
                    onChange={(event) => handelChangeNote(event.target.value)}
                    type="text"
                    value={noteScript}
                    placeholder="New note"
                  />
                </div>
                <div className="groupEndBtn">
                  <button className="debug" onClick={handleOpenDebug}>
                    <img src={debug} alt="Debug" />
                  </button>
                  <PopupDebug
                    profiles={profileSelected}
                    debugScript={true}
                    debugs={debugs}
                    openDebug={openDebug}
                    handleCloseDebug={handleCloseDebug}
                  ></PopupDebug>
                  <button className="test" onClick={handleOpenProfiles}>
                    <img src={runTest} alt="run test" />
                  </button>
                  <PopupChooseProfile
                    selectProfile={selectProfile}
                    designScript={designScript}
                    openProfiles={openProfiles}
                    handleCloseProfiles={handleCloseProfiles}
                  ></PopupChooseProfile>
                  {/* <button className="more">
                    <img src={option} alt="More" />
                  </button> */}
                  <button
                    onClick={() => {
                      onSave();
                    }}
                    className="saveBtn"
                  >
                    <img src={save} alt="Save" />
                    SAVE
                  </button>
                </div>
              </div>
              <div className="right-content__container">
                <DnDFlow
                  addNewNode={onAddNewNode}
                  ref={DnDFlowRef}
                  itemScript={state}
                  handleDeleteNode={handleDeleteNode}
                  onMessageChange={handleMessageChange}
                ></DnDFlow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateScript;
