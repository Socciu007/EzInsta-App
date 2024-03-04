import React from 'react';
import PopupComponent from '../PopupComponent/PopupComponent';
import './style.scss';

const PopupDeleteProfile = ({ openDeleteProfile, handleCloseDelete, handleRemove }) => {
  return (
    <PopupComponent open={openDeleteProfile} onClose={handleCloseDelete}>
      {
        <div className="-delete-profiles">
          <div className="-delete-profiles__content">
            <h1>REMOVE</h1>
            <p>Are you sure to remove the profiles?</p>
            <div className="-delete-profiles__content__confirm">
              <button type="button" style={{ background: '#F5F5F5', color: '#01162B' }} onClick={handleCloseDelete}>
                Cancel
              </button>
              <button type="button" style={{ background: '#2A86FF', color: '#fff' }} onClick={handleRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      }
    </PopupComponent>
  );
};

export default PopupDeleteProfile;
