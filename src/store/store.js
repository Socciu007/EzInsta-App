import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../redux/profileSlice';
import scriptAutoReducer from '../redux/scriptAutoSlice';
import debugReducer from '../redux/debugSlice';
export default configureStore({
  reducer: {
    profile: profileReducer,
    scriptAuto: scriptAutoReducer,
    debug: debugReducer,
  },
});
