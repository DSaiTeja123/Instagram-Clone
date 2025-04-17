import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    followState: {},
    colorToggled: false,
  },
  reducers: {
    setAuthUser:(state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    // setFollowState: (state, action) => {
    //   const userId = action.payload.userId;
    //   state.followState[userId] = !state.followState[userId];
    // },
    setColorToggled: (state, action) => {
      state.colorToggled = action.payload;
    },
  }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setColorToggled } = authSlice.actions;
export default authSlice.reducer;