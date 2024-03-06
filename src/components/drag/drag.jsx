import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import startingPointNode from '../nodes/startingPoint';
import watchStoryNode from '../nodes/watchStory';
import watchVideoNode from '../nodes/watchVideo';
import newsFeedNode from '../nodes/newsfeed';
import createPostNode from '../nodes/createPost';
import postInteractNode from '../nodes/postInteract';
import deletePostNode from '../nodes/deletePost';
import viewNotiNode from '../nodes/viewNoti';
import sendMsgNode from '../nodes/sendMsg';
import replyMsgNode from '../nodes/replyMsg';
import updateProfileNode from '../nodes/updateProfile';
import directMsgNode from '../nodes/directMsg';
import unfollowNode from '../nodes/unfollow';
import followNode from '../nodes/follow';
import hashtagInteractionNode from '../nodes/hashtagInteraction';
import followInteractionNode from '../nodes/followInteraction';
const initialNodes = [
  {
    id: '1',
    type: 'startingPoint',
    data: { label: 'Starting Point' },
    position: { x: 250, y: 250 },
  },
];
const nodeTypes = {
  startingPoint: startingPointNode,
  watchStory: watchStoryNode,
  watchVideo: watchVideoNode,
  newsFeed: newsFeedNode,
  createPost: createPostNode,
  postInteract: postInteractNode,
  deletePost: deletePostNode,
  viewNoti: viewNotiNode,
  sendMsg: sendMsgNode,
  replyMsg: replyMsgNode,
  updateProfile: updateProfileNode,
  seedingPost: postInteractNode,
  directMsg: directMsgNode,
  unfollow: unfollowNode,
  follow: followNode,
  hashtagInteraction: hashtagInteractionNode,
  followInteraction: followInteractionNode,
};
const nodeMessage = {
  watchStory: 'watchStory',
  watchVideo: 'watchVideo',
  newsFeed: 'newsFeed',
  createPost: 'createPost',
  postInteract: 'postInteract',
  deletePost: 'deletePost',
  viewNoti: 'viewNoti',
  sendMsg: 'sendMsg',
  replyMsg: 'replyMsg',
  updateProfile: 'updateProfile',
  cancelFriend: 'cancelFriend',
  seedingPost: 'seedingPost',
  directMsg: 'directMsg',
  unfollow: 'unfollow',
  follow: 'follow',
  hashtagInteraction: 'hashtagInteraction',
  followInteraction: 'followInteraction',
};

const getId = () => `dndnode_${+new Date()}`;

const DnDFlow = forwardRef(({ onMessageChange, handleDeleteNode, addNewNode, itemScript }, ref) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const handleNodeButtonClick = (type, id) => {
    onMessageChange(type, id);
  };
  const handleDeleteNodeClick = (idToDelete) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== idToDelete));
    handleDeleteNode(idToDelete);
  };

  useImperativeHandle(ref, () => ({
    getReactFlowInstance() {
      return reactFlowInstance.toObject();
    },
  }));

  useEffect(() => {
    if (itemScript && itemScript.design) {
      setNodes(
        itemScript.design.nodes.map((e) => {
          return {
            ...e,
            data: {
              label: `${e.type} node`,
              onButtonClick: () => handleNodeButtonClick(e.type, e.id),
              onDeleteNode: () => handleDeleteNodeClick(e.id),
            },
          };
        }),
      );
      setEdges(itemScript.design.edges);
    }
  }, []);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: '#333',
      },
      style: {
        strokeWidth: 2,
        stroke: '#333',
      },
    };

    setEdges((eds) => addEdge(newEdge, eds)), [];
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = getId();

      const newNode = {
        id,
        type,
        position,
        data: {
          label: `${type} node`,
          onButtonClick: (id) => handleNodeButtonClick(nodeMessage[type], id),
          onDeleteNode: handleDeleteNodeClick,
        },
        dragging: false,
      };
      addNewNode(type, id);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, handleNodeButtonClick],
  );

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
          >
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
});

export default DnDFlow;
