import { createSlice } from "@reduxjs/toolkit";

const teacherSlice = createSlice({
    name : 'teachers',
    initialState : {
        isAdmin : false,
        teacherInfo : []
    },
    reducers : {
        setIsAdmin(state, actions){
            state.isAdmin = actions.payload
        },
        setTeacherInfo(state, actions){
            state.teacherInfo = actions.payload
        }
    }
})
export const {
    setIsAdmin,
    setTeacherInfo
} = teacherSlice.actions
export default teacherSlice.reducer

//Thunk Functions 
// export function processLoginRequest() {
//     return async function processCognitoLogin(dispatch) {
//         try {
//             await 
//         }
        
//     }
// }