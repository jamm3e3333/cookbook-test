import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuth: false,
    token: '',
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

        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;