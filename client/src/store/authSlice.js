import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    colorToggled: false,
    followings: [],
  },
  reducers: {
    setAuthUser:(state, action) => {
      state.user = action.payload;
      state.followings = action.payload?.following || [];
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
    setColorToggled: (state, action) => {
      state.colorToggled = action.payload;
    },
    followUser: (state, action) => {
    const userId = action.payload;
    if (!state.followings.includes(userId)) {
      state.followings.push(userId);
    }
  },
  unfollowUser: (state, action) => {
    const userId = action.payload;
    state.followings = state.followings.filter(id => id !== userId);
  },
  }
});

export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setColorToggled, followUser, unfollowUser } = authSlice.actions;
export default authSlice.reducer;