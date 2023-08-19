import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    is_admin: false,
    user: {},
    autoLogout: null
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.is_admin = action.payload.is_admin;
            state.user = action.payload.user;
            state.autoLogout = action.payload.autoLogout;
        },

        logout: state => {
            state.token = "";
            state.is_admin = false;
            state.user = {};
            state.autoLogout = null;
        },

        changePassword: (state, action) => {
            state.user.password = action.payload.password;
        }
    }
})


export const { login, logout, changePassword } = authSlice.actions;

export default authSlice.reducer;




