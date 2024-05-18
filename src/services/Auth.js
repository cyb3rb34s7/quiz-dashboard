import axios from "axios";
import { api } from "./Axios";
import { useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import { setUserToken } from "../store/authenticationSlice";

// const { userToken}  = useSelector((state) => state.authentication)
// const dispatch = useDispatch()

export const redirectToLogin = () => {
    const dispatch = store.dispatch
    // console.log("redirect to login")
    localStorage.removeItem('token');
    dispatch(setUserToken(''))
    window.location.replace(`https://auth.cs.yesquiz.in/login?client_id=${import.meta.env.VITE_APP_COGNITO_APP_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_APP_COGNITO_REDIRECT_URI}`);
}

export const getToken = () => {
    if (localStorage.getItem('token') || store.getState().authentication.userToken) {
        return localStorage.getItem('token') || store.getState().authentication.userToken;
    }
    return null;
}

export const checkToken = async () => {
    try {
        const response = await api.get('/auth');
        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        // console.log(error);
    }
    return false;
}

export const login = async (code) => {
    if (code) {
        try {
            const dispatch = store.dispatch
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth`, { "code": code });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                dispatch(setUserToken(response.data.token))
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                return true;
            }
            localStorage.removeItem('token');
            dispatch(setUserToken(''))
        } catch (error) {
            // console.log(error);
        }
    }
    return false;
}

export const logout = async () => {
    try {
        const response = await api.get('/auth/logout');
        if (response.status === 200) {
            const dispatch = store.dispatch
            localStorage.removeItem('token');
            dispatch(setUserToken(''))
            window.location.replace(`https://auth.cs.yesquiz.in/logout?response_type=code&client_id=${import.meta.env.VITE_APP_COGNITO_APP_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_APP_COGNITO_REDIRECT_URI}`);
            return true;
        }
    } catch (error) {
        // console.log(error);
    }
    return false;
}