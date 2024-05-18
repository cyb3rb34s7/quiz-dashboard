import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
    name : 'authentication',
    initialState : {
        isAuthenticated : false,
        userToken : '',
        userName : '',
        refreshToken : '',
        userEmail : ''
    },
    reducers : {
        setAuthStatus(state, actions){
            state.isAuthenticated = actions.payload
        },
        setUserToken(state, actions){
            state.userToken = actions.payload
        },
        setUserName(state, actions){
            state.userName = actions.payload
        },
        setUserEmail(state, actions){
            state.userEmail = actions.payload
        },
        setRefreshToken(state, actions){
            state.refreshToken = actions.payload
        }
    }
})
export const {
    setRefreshToken,
    setAuthStatus,
    setUserEmail,
    setUserName,
    setUserToken
} = authenticationSlice.actions
export default authenticationSlice.reducer

//Thunk Functions 
// export function processLoginRequest() {
//     return async function processCognitoLogin(dispatch) {
//         try {
//             await 
//         }
        
//     }
// }