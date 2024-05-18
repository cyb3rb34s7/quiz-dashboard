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
export const getAllQuiz = async () => {
   
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/quiz`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
    return false;
}

export const getQuizById =async (quizId) => {
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/quiz/${quizId}`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
}
export const addQuiz =async (requestBody) => {
    try{
    const response = await api.post(`${VITE_API_BASE_URL}/api/v1/quiz`, requestBody);
        if(response){
            return response
        }}
        catch(Error){
        throw new Error(Error.status.toString())
    }
}
export const updateQuiz =async (requestBody,quizId) => {
  try{
  const response = await api.post(`${VITE_API_BASE_URL}/api/v1/quiz/${quizId}`, requestBody);
      if(response){
        return response
    }
  }
catch(Error){
  throw new Error(Error.status.toString())
}
}
