import React from 'react';
import Popup from 'reactjs-popup';

const PopupComponent = (props) => {
  const { open, onClose, children } = props;
  return (
    <Popup open={open} onClose={onClose}>
      {children}
    </Popup>
  );
};

export default PopupComponent;
