import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './account/accountSlice';
import menuReducer from './menu/menuSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    menu: menuReducer
  },
});
