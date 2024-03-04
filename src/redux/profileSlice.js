import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: [],
  reducers: {
    updateProfiles: (state, action) => {
      let newArr = [];
      if (state && state.length) {
        newArr = [...state];
        action.payload.forEach((profile) => {
          const index = state.findIndex((e) => e.id == profile.id);
          if (index >= 0) {
            newArr[index] = profile;
          } else {
            newArr.push(profile);
          }
        });
      } else {
        newArr = action.payload;
      }
      return newArr;
    },
    updateProfile: (state, action) => {
      const index = state.findIndex((e) => e.id == action.payload.id);
      const newState = [...state];
      if (index >= 0) newState[index] = action.payload;
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProfiles, updateProfile } = profileSlice.actions;

export default profileSlice.reducer;
