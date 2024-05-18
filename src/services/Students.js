import axios from "axios";
import { api } from "./AxiosInterceptor";
// const VITE_API_BASE_URL = "http://yesquiz-stage.eba-gwufjrqj.ap-south-1.elasticbeanstalk.com/api/v1/"
const VITE_API_BASE_URL =  import.meta.env.VITE_APP_API_URL

export const getStudentsById = async (id) => {
   
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/students/${id}`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
    return false;
}
export const getStudents = async () => {
   
    try {
        const response = await api.get(`${VITE_API_BASE_URL}/api/v1/students`);
        
        if (response.data && response.statusText === "OK") {
            
           return response.data;
        }
    } catch (error) {
        throw new Error(Error.status.toString())
    }
    return false;
}
