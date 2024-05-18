import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "./authenticationSlice";
import teacherSlice from "./teacherSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
const persistConfig = {
    key: 'root',
    storage
  };
const persistedAuth = persistReducer(persistConfig, authenticationSlice)
const persistedTeacher = persistReducer(persistConfig, teacherSlice)
const store  = configureStore({
    reducer: {
       authentication :  persistedAuth,
        teacher : persistedTeacher
    }
})
export default store