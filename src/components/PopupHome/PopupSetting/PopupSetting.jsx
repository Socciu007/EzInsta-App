import React from 'react';
import './style.scss';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import Dialog from '@mui/material/Dialog';
import SettingsPage from '../../../pages/SettingsPage/SettingsPage';

const PopupSetting = ({ openSettings, handleCloseSettings }) => {
  const makeCopy = {
    position: 'fixed',
    maxWidth: '100% !important',
    width: '1163px',
    height: '679px',
    top: '50%',
    left: '50%',
    transform: ' translate(-50%, -50%)',
    borderRadius: '15px',
    background: '#fff',
    boxShadow: '0px 4px 10px 0px rgba(8, 35, 106, 0.25)',
    flexShrink: '0',
    zIndex: '99999',
    margin: '0',
    overflow: 'inherit !important',
  };

  const overlay = {
    background: 'rgba(255,255,255,0.9)',
  };
  const MuiDialogPaper = {
    width: '1163px',
    height: '679px',
    maxHeight: '679px !important',
    minWidth: '1163px !important',
    color: '#01162b !important',
  };
  const MuiDialogContainerSetting = {
    display: 'block',
  };
  return (
    <Dialog
      open={openSettings}
      onClose={handleCloseSettings}
      sx={{
        '& .MuiPaper-root': makeCopy,
        '& .MuiBackdrop-root': overlay,
        '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': MuiDialogPaper,
        '& .MuiDialog-container': MuiDialogContainerSetting,
      }}
    >
      <SettingsPage component={true} handleCloseSettings={handleCloseSettings}></SettingsPage>
    </Dialog>
  );
};

export default PopupSetting;
