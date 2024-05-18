import React, { useContext, useEffect, useRef, useState } from "react";
import { dataContext } from "../../contexts/store";
import { Helmet } from "react-helmet-async";
import CheckboxDropdown from "../../components/CheckboxDropdown";
import { papers, subjects } from "../../constants/Constants";
import SearchBar from "../../components/SearchBar";
import Card from "../../components/Card";
import NoData from "../../components/NoData";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import HandlerButtons from "../../components/HandlerButtons";
import { addTeachers, getAllTeachers } from "../../services/Teachers";
import {  notification } from 'antd';
import { useSelector } from "react-redux";
export const requiredKeys = ["Name", "Phone", "Subjects"];

const itemsPerView = 10;

const Teachers = () => {

  const {isAdmin}  = useSelector((state) => state.teacher)
  const {
    teachers,
    updateTeachers,
    teachersFormData,
    updateTeachersFormData,
    teachersFormAlert,
    updateTeachersFormAlert,
    setTeachers,
  } = useContext(dataContext);
  const largeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const formRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(itemsPerView);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type,title, description) => {
    api[type]({
      message: title,
      description: description,
    });
  };
  const successMessage = "User Added Successfully.";
  const errorMessage = "User addition failed.";
  
  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView);
  };
  const fetchData = async () => {
    try {
      // Make API request to fetch teachers data
      const response = await getAllTeachers();
      // console.log(response); // Log the response after it's resolved
      setTeachers((teachers) => ({ ...teachers, allTeachers: response }));
    } catch (error) {
      console.error("Error fetching teachers data:", error);
    }
  };
  useEffect(() => {


    fetchData(); // Call the async function to fetch data
  }, []);
  const showLess = () => {
    setVisibleItems(itemsPerView);
  };

  const handleSearch = (newValue) => {
    updateTeachers((teachers) => ({ ...teachers, searchString: newValue }));
  };

  const handleChange = (e) => {
    updateTeachersFormData((teachersFormData) => ({
      ...teachersFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubjectsChange = (value) => {

    if (teachersFormData.subjects.includes(value)) {
      updateTeachersFormData((teachersFormData) => ({
        ...teachersFormData,
        subjects: teachersFormData.subjects.filter(
          (subject) => subject !== value
        ),
      }));
    } else {
      updateTeachersFormData((teachersFormData) => ({
        ...teachersFormData,
        subjects: [...teachersFormData.subjects, value],
      }));
    }
    
  };

  const handleSubSubjectsChange = (value) => {
    if (teachersFormData.subSubjects.includes(value)) {
      updateTeachersFormData((teachersFormData) => ({
        ...teachersFormData,
        subSubjects: teachersFormData.subSubjects.filter(
          (subject) => subject !== value
        ),
      }));
    } else {
      updateTeachersFormData((teachersFormData) => ({
        ...teachersFormData,
        subSubjects: [...teachersFormData.subSubjects, value],
      }));
    }
  };
  //TODO
  // const mergeSubjects = (selectedCourses, subjects) => {
  //   let mergedSubjects = {};
  //   console.log(selectedCourses)
  //   console.log(subjects)
  //   selectedCourses.forEach(course => {
  //     mergedSubjects[course] = subjects[course];
  //   });
  //   return mergedSubjects;
  // };
  const formatData = (data) => {
    const formattedData = { ...data };
    formattedData.subjects = formattedData.subjects.reduce((acc, subject) => {
      if (!acc[subject]) {
        acc[subject] = [];
      }
      formattedData.subSubjects.forEach(subSubject => {
        acc[subject].push(subSubject);
      });
      return acc;
    }, {});
    delete formattedData.subSubjects;
    return formattedData;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formattedData = formatData(teachersFormData);
     
        try {
        // Make API request to post  teachers data
        const response = await addTeachers(formattedData);
        if(response){
          openNotificationWithIcon('success','Success', successMessage)
          fetchData()
          if (formRef.current) {
            formRef.current.reset();
            updateTeachersFormData((teachersFormData) => ({
              ...teachersFormData,
              subjects:[],
              subSubjects: []
            }));
          }
        }
      } catch (error) {
        openNotificationWithIcon('error','Error', errorMessage)
        console.error("Error fetching teachers data:", error);
      }
      // setLoading(true);
      // api.post(`${process.env.REACT_APP_API_URL}/add_emp`, credentials)
      //   .then((res) => {
      //     if (res.data.message && res.data.message !== "success") {
      //       setVariant("danger");
      //       setAlert((prev) => ({ ...prev, code: res.data.message }));
      //       setTimeout(() => {
      //         setAlert((prev) => ({ ...prev, code: "" }));
      //         setVariant("");
      //       }, 5000)
      //     } else {
      //       formRef.current.reset();
      //       setCredentials(initial);
      //       setVariant("success");
      //       setAlert((prev) => ({ ...prev, code: "Account created successfully!" }));
      //       setTimeout(() => {
      //         setAlert((prev) => ({ ...prev, code: "" }));
      //         setVariant("");
      //       }, 5000)
      //     }
      //   })
      //   .catch((err) => {
      //     // console.log(err);
      //     setVariant("danger");
      //     setAlert((prev) => ({ ...prev, code: "Something went wrong, please try again later!" }));
      //     setTimeout(() => {
      //       setAlert((prev) => ({ ...prev, code: "" }));
      //       setVariant("");
      //     }, 5000)
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   })
    }
  };

  const validateForm = () => {
    let flag = false;
    if (teachersFormData.first_name === "") {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        first_name: "First Name is required",
      }));
      flag = true;
    }
    if (teachersFormData.last_name === "") {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        last_name: "Last Name is required",
      }));
      flag = true;
    }
    // if (/\s/.test(teachersFormData.last_name)) {
    //   updateTeachersFormAlert((prev) => ({ ...prev, last_name: "Last Name cannot contain spaces" }));
    //   flag = true;
    // }
    if (!/^\w+(-?\w+)*@\w+(-?\w+)*(\.\w{2,3})+$/.test(teachersFormData.email)) {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      flag = true;
    }
    if (teachersFormData.email === "") {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        email: "Email is required",
      }));
      flag = true;
    }
    if (teachersFormData.phone.match(/^\d{10}$/) === null) {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        phone: "Please enter a valid 10 digit phone number",
      }));
      flag = true;
    }
    if (teachersFormData.phone === "") {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        phone: "Phone is required",
      }));
      flag = true;
    }
    if (teachersFormData.subjects.length === 0) {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        subjects: "Please select at least one course",
      }));
      flag = true;
    }
    if (teachersFormData.subSubjects.length === 0) {
      updateTeachersFormAlert((prev) => ({
        ...prev,
        subSubjects: "Please select a subject at least one subject",
      }));
      flag = true;
    }
    return !flag;
  };

  useEffect(() => {
    if (teachersFormData.first_name !== "") {
      updateTeachersFormAlert((prev) => ({ ...prev, first_name: "" }));
    }
    if (teachersFormData.last_name !== "") {
      updateTeachersFormAlert((prev) => ({ ...prev, last_name: "" }));
    }
    // if (!(/\s/.test(teachersFormData.last_name))) {
    //   updateTeachersFormAlert((prev) => ({ ...prev, last_name: "" }));
    // }
    if (/^\w+(-?\w+)*@\w+(-?\w+)*(\.\w{2,3})+$/.test(teachersFormData.email)) {
      updateTeachersFormAlert((prev) => ({ ...prev, email: "" }));
    }
    if (teachersFormData.email !== "") {
      updateTeachersFormAlert((prev) => ({ ...prev, email: "" }));
    }
    if (teachersFormData.phone.match(/^\d{10}$/) !== null) {
      updateTeachersFormAlert((prev) => ({ ...prev, phone: "" }));
    }
    if (teachersFormData.phone !== "") {
      updateTeachersFormAlert((prev) => ({ ...prev, phone: "" }));
    }
    if (teachersFormData.subjects.length !== 0) {
      updateTeachersFormAlert((prev) => ({ ...prev, subjects: "" }));
    }
    if (teachersFormData.subSubjects.length !== 0) {
      updateTeachersFormAlert((prev) => ({ ...prev, subSubjects: "" }));
    }
  }, [
    teachersFormData.first_name,
    teachersFormData.last_name,
    teachersFormData.email,
    teachersFormData.phone,
    teachersFormData.subjects,
    teachersFormData.subSubjects,
  ]);

  // console.log(teachers);

  return (
    <>
    
      <Helmet>
        <title>Quiz App - Add Teacher</title>
      </Helmet>
      {contextHolder}
      <h1 className="page-heading fxlarge fbolder mb1">Teachers</h1>
      {isAdmin  &&  (<div className="card mb1">
        <form
          className="d-grid-cols twelve-columns gap1 mvhalf"
          id="add-teacher-form"
          ref={formRef}
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="form-group col-6">
            <label htmlFor="first_name">
              First Name<span className="mandatory"> *</span>
            </label>
            <br />
            <input
              type="text"
              className="form-input"
              name="first_name"
              id="first_name"
              onChange={handleChange}
            />
            <br />
            {teachersFormAlert.first_name && (
              <div className="alert mthalf">{teachersFormAlert.first_name}</div>
            )}
          </div>
          <div className="form-group col-6">
            <label htmlFor="last_name">
              Last Name<span className="mandatory"> *</span>
            </label>
            <br />
            <input
              type="text"
              className="form-input"
              name="last_name"
              id="last_name"
              onChange={handleChange}
            />
            <br />
            {teachersFormAlert.last_name && (
              <div className="alert mthalf">{teachersFormAlert.last_name}</div>
            )}
          </div>
          <div className="form-group col-6">
            <label htmlFor="email">
              Email<span className="mandatory"> *</span>
            </label>
            <br />
            <input
              type="text"
              className="form-input"
              name="email"
              id="email"
              onChange={handleChange}
            />
            <br />
            {teachersFormAlert.email && (
              <div className="alert mthalf">{teachersFormAlert.email}</div>
            )}
          </div>
          <div className="form-group col-6">
            <label htmlFor="phone">
              Phone<span className="mandatory"> *</span>
            </label>
            <br />
            <input
              type="text"
              className="form-input"
              name="phone"
              id="phone"
              onChange={handleChange}
            />
            <br />
            {teachersFormAlert.phone && (
              <div className="alert mthalf">{teachersFormAlert.phone}</div>
            )}
          </div>
          <div className="form-group col-6">
            <label htmlFor="subjects">
              Courses<span className="mandatory"> *</span>
            </label>
            <br />
            <CheckboxDropdown
              nameOfLabel="subjects"
              checkOptions={papers}
              selectedOptions={teachersFormData.subjects}
              handleChange={handleSubjectsChange}
            />
            {teachersFormAlert.subjects && (
              <div className="alert mthalf">{teachersFormAlert.subjects}</div>
            )}
          </div>
          {teachersFormData.subjects.length>0 && (
          <div className="form-group col-6">
            <label htmlFor="subjects">
              Subjects<span className="mandatory"> *</span>
            </label>
            <br />
            <CheckboxDropdown
              nameOfLabel="subjects"
              checkOptions={subjects[teachersFormData.subjects]}
              selectedOptions={teachersFormData.subSubjects}
              handleChange={handleSubSubjectsChange}
            />
            {teachersFormAlert.subSubjects && (
              <div className="alert mthalf">{teachersFormAlert.subSubjects}</div>
            )}
          </div>)}
          <div className="form-group col-12 d-flex-row justify-center align-center">
            <div className="alert flex-1 text-center">
              {teachersFormAlert.general ? teachersFormAlert.general : ""}
            </div>
            <button className="btn" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>)}
      <SearchBar
        valueString={teachers.searchString}
        handleChange={handleSearch}
      />
      <h3 className="text-secondary mv1">All</h3>
      {teachers['allTeachers'].length > 0 ?
        <>
          <div className="teacher-cards d-grid-cols gap1 twelve-columns pb1">
            {teachers.allTeachers.slice(0, visibleItems).map((item) =>
              // <Link to={`/teachers/${item.Name.toLowerCase().replace(' ', '-')}`} className={`card-link col-${largeScreen ? 4 : 6}`} key={item.id} state={item}>
              //   <Card
              //     data={requiredKeys.map((key) => ({ label: key, value: key === 'Subjects' ? Object.keys(item[key]).join(', ') : item[key] }))}
              //     logo='raja.jpg'
              //   />
              // </Link>
              <Link
                  to={`/teachers/${item._id}`}
                  className={`card-link col-${largeScreen ? 4 : 6}`}
                  key={item._id}
                  state={item}
                >
                  <Card
                    data={requiredKeys.map((key) => ({
                      label: key,
                      value:
                        key === "Name"
                          ? `${item.first_name} ${item.last_name}`
                          : key === "Phone"
                          ? item.phone
                          : key === "Subjects"
                          ? Object.keys(item.subjects).join(", ")
                          : item[key],
                    }))}
                    // {...console.log(requiredKeys)}
                    logo={requiredKeys.some(key => key.toLowerCase() === "name") ?   `${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}` : ""}
                  />
                </Link>
            )}
          </div>
          <HandlerButtons
            cardArray={teachers.allTeachers}
            itemsPerView={itemsPerView}
            visibleItems={visibleItems}
            onViewLess={showLess}
            onViewMore={showMore}
          />
        </>
        : <NoData span={12} />}
        </>)
}

export default Teachers;
