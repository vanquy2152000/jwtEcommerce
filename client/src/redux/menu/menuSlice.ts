import { createSlice } from '@reduxjs/toolkit';

interface MenuState {
  activeMenu: string
}

const initialState: MenuState = {
  activeMenu: 'dashboard'
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    doSetActiveMenu: (state, action) => {
      localStorage.setItem('activeMenu', state.activeMenu);
      state.activeMenu = action.payload;
    },

    extraReducers: (builder) => {

    },
  }
});

export const { doSetActiveMenu } = menuSlice.actions;

export default menuSlice.reducer;
