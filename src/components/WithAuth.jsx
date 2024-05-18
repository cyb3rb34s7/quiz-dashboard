import { useState, useEffect, useContext } from "react";
import { dataContext } from "../contexts/store";
import { api } from "../services/Axios";
import { checkToken, getToken, login, redirectToLogin } from "../services/Auth";

// HOC that checks for the presence of the grant code and id token
// and redirects the user to the sign-in page if either is missing
const WithAuth = (Component) => {
  const NestedComponent = () => {

    const { groupCallback, updateMe } = useContext(dataContext);
    const [asyncData, setAsyncData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

      // const setInitialData = async () => {
      //   try {
      //     const response = await api.get('teachers/')
      //     if (response.data) {
      //       updateMe({
      //         ...response.data,
      //         "profilePic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      //         "Subject-wise Performance": {
      //           "Company Law": 60,
      //           "Cost & Management Accounting": 60,
      //           "Economic & Commercial Laws": 60,
      //           "Tax Laws & Practice": 60,
      //           "Company Accounts & Auditing Practices": 60,
      //           "Capital Market & Securities Laws": 60,
      //           "Industrial Labor & General Laws": 60,
      //           "Financial & Strategic Management": 60
      //         },
      //         "Last Five Quiz Performances of Students": {
      //           "Quiz 1": 60,
      //           "Quiz 2": 60,
      //           "Quiz 3": 60,
      //           "Quiz 4": 60,
      //           "Quiz 5": 60
      //         },
      //         "students": [
      //           {
      //             "id": 1,
      //             "Name": "Student 1",
      //             "Subjects": ["businessCommunication", "currentAffairs"],
      //             "Total Score": 1500,
      //             "profilePic": "https://www.flaticon.com/svg/static/icons/svg/3135/3135715.svg"
      //           },
      //           {
      //             "id": 2,
      //             "Name": "Student 2",
      //             "Subjects": ["businessCommunication", "currentAffairs"],
      //             "Total Score": 1400,
      //             "profilePic": "https://www.flaticon.com/svg/static/icons/svg/3135/3135715.svg"
      //           },
      //           {
      //             "id": 3,
      //             "Name": "Student 3",
      //             "Subjects": ["businessCommunication", "currentAffairs"],
      //             "Total Score": 4200,
      //             "profilePic": "https://www.flaticon.com/svg/static/icons/svg/3135/3135715.svg"
      //           }
      //         ]
      //       })
      //       groupCallback(response.data.admin ? "admin" : "teacher")
      //     }
      //   } catch (err) {
      //     // console.log(err);
      //     // updateMe({})
      //     // groupCallback("")
      //   }
      // };

      const func = async () => {
        const token = getToken();
        const code = new URLSearchParams(window.location.search).get("code");
        if (token) {
          const alreadyLoggedIn = await checkToken(token);
          if (alreadyLoggedIn) {
            setAsyncData(true);
            // setInitialData();
          }
        } else if (code) {
          const isLoggedIn = await login(code);
          if (isLoggedIn) {
            setAsyncData(true);
            // setInitialData();
          }
        }
        setIsLoading(false);
        return null;
      };

      func();
    }, []);

    if (isLoading) {
      return null;
    } else {
      return asyncData ? <Component /> : redirectToLogin();
    }
  };

  return NestedComponent;
};

export default WithAuth;
