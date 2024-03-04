import { createSlice } from '@reduxjs/toolkit';

export const scriptAutoSlice = createSlice({
  name: 'scriptAuto',
  initialState: '',
  reducers: {
    setScriptAuto: (state, action) => {
      // action.payload is an array of profiles to be updated
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setScriptAuto } = scriptAutoSlice.actions;

export default scriptAutoSlice.reducer;
