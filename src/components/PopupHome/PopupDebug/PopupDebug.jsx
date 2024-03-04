import React, { useEffect, useState } from 'react';
import closePopup from '../../../assets/pictures/icon-x.svg';
import './style.scss';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import Dialog from '@mui/material/Dialog';
import img_debug from '../../../assets/images/img_debug.png';
const PopupDebug = ({ openDebug, handleCloseDebug, debugs }) => {
  const makeCopyDebug = {
    position: 'fixed',
    maxWidth: '100%',
    width: '1050px',
    height: 'auto',
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
  const MuiDialogPaperDebug = {
    width: '1050px',
    height: 'auto',
    maxHeight: '679px !important',
    minWidth: '1050px !important',
    color: '#01162b !important',
  };
  const MuiDialogContainerDebug = {
    display: 'block',
  };
  return (
    <>
      <Dialog
        open={openDebug}
        onClose={handleCloseDebug}
        sx={{
          '& .MuiPaper-root[role="dialog"]': makeCopyDebug,
          '& .MuiBackdrop-root': overlay,
          '& .css-1t1j96h-MuiPaper-root-MuiDialog-paper': MuiDialogPaperDebug,
          '& .MuiDialog-container': MuiDialogContainerDebug,
        }}
      >
        <div className="-layout-debug">
          <div className="-layout-debug__container">
            <div className="-nav-scripts">
              <div className="-nav-scripts__header">
                <h1>DEBUG</h1>
              </div>
              <div className="-wrapper-option-profiles -nav-scripts__btn">
                <div
                  className="-nav-scripts__btn__close"
                  onClick={() => {
                    handleCloseDebug();
                  }}
                >
                  <img src={closePopup} alt="icon-x"></img>
                </div>
              </div>
            </div>
            <div className="-layout-debug__container__debugs">
              {debugs && debugs.length ? (
                debugs.map((e, index) => (
                  <div key={index}>
                    <p style={{ fontWeight: '700' }}>{e.name}</p>
                    <div className="contentDebugs" key={index}>
                      <p style={{ color: 'gray' }}>{e.script ? e.script + ':' : ''}</p>
                      <p style={{ color: 'red', marginLeft: 4 }}>{e.err}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
                >
                  <img style={{ width: 200 }} className="imgNoBug" src={img_debug} alt="img debug" />
                  <p className="noBug">No bugs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PopupDebug;
