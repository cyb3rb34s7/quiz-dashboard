import axios from "axios";
import { api } from "./AxiosInterceptor";
// const VITE_API_BASE_URL = "http://yesquiz-stage.eba-gwufjrqj.ap-south-1.elasticbeanstalk.com/api/v1/"
const VITE_API_BASE_URL =  import.meta.env.VITE_APP_API_URL
// export const getAllTeachers =async () => {
//      const requestUrl = `${process.env.REACT_APP_API_URL}/teachers`
//     return await api.get(requestUrl).then((response)=>{
//         if(response){
//             console.log(response)
//             return response
//         }
//     }).catch((Error)=>{
//         throw new Error(Error.status.toString())
//     })
// }
export const getInfo = async () => {
   
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/teachers`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
    return false;
}
export const getAllTeachers = async () => {
   
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/teachers/all`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
    return false;
}
export const getTeacherById =async (teacherId) => {
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/teachers/${teacherId}`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
}
export const addTeachers =async (requestBody) => {
    try{
    const response = await api.post(`${VITE_API_BASE_URL}/api/v1/teachers`, requestBody);
        if(response){
            return response
        }}
        catch(Error){
        throw new Error(Error.status.toString())
    }
}
export const updateTeachers =async (requestBody,teacherId) => {
    const requestUrl = `${process.env.REACT_APP_API_URL}/teachers/${teacherId}`
    return await api.put(requestUrl, requestBody).then((response)=>{
        if(response){
            return response
        }
    }).catch((Error)=>{
        throw new Error(Error.status.toString())
    })
}