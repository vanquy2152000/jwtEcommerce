import { createSlice } from '@reduxjs/toolkit';


interface IUser {
  email: string;
  phone: string;
  fullName: string;
  role: string;
  avatar: string;
  id: string;
}

interface AccountState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser
}

const initialState: AccountState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: ""
  }
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    doLoginUser: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user
    },
    doLogoutUser: (state) => {
      localStorage.removeItem('access_token')
      state.isAuthenticated = false;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
      }
    }
  },

  extraReducers: (builder) => {

  },
});

export const { doLoginUser, doGetAccountAction, doLogoutUser } = accountSlice.actions;

export default accountSlice.reducer;
