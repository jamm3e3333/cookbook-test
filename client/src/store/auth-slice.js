import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuth: false,
    token: '',
    page: 0,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: { 
        signUp(state, action) {
            state.user = {
                _id: action.payload._id,
                email: action.payload.email,
                nick: action.payload.nick,
            }
            state.isAuth = true;
            state.token = action.payload.token;
        },
        signOut(state) {
            state.user = null;
            state.isAuth = false;
            state.token = '';
            state.page = 0;
        },
        changePage(state, action) {
            state.page = action.payload;
        }

    }
});

export const authActions = authSlice.actions;

export default authSlice;