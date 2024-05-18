import { useState, useEffect } from 'react'
import { dataContext } from './store'
import { initialUploadTest } from '../constants/Constants'
import data from '../../api.json'

const initialTests = {
    searchString: "",
    fromDateObject: null,
    toDateObject: null,
    fromDateString: "",
    toDateString: "",
    filteredTests: [],
    // data['get-quizzes(query-string-will-have-date-filters)'],
}

const initialStudents = {
    searchString: "",
    recentStudents: data['get-recent-students'],
    allStudents: data['get-students/post-students'],
}

const initialTeachers = {
    searchString: "",
    allTeachers: []
    //data["get-teachers/post-teachers"]
}

const initialTeachersFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subjects: [],
    subSubjects: []
}

const initialTeachersFormAlert = {
    general: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subjects: "",
    subSubjects: []
}

const updateProfileObject = {
    first_name: data['me'].first_name,
    last_name: data['me'].last_name,
    phone: data['me'].phone,
    email : data['me'].Email,
    profilePicture: ""
}

const initialUpdateProfileAlert = {
    general: "",
    first_name: "",
    last_name: "",
    phone: ""
}

const initialUploadTestAlert = {
    general: "",
    name: "",
    type: "",
    class: "",
    quizStartDateTime: "",
    quizEndDateTime: "",
    quizDuration: "",
    quizIcon: "",
}

const testSearchKeys = ["Name", "Type", "Subject", 'quizStartDate', 'quizEndDate', 'quizStartTime', 'quizEndTime', 'quizDuration']
const studentSearchKeys = ["Name", "Email", "Phone", "Academy", "Total Score"]
const teacherSearchKeys = ["Name", "Email", "Phone", "Subjects"]

const DataContext = ({ children }) => {
    const [group, setGroup] = useState("admin");
    const [loading, setLoading] = useState(false);
    const [tests, setTests] = useState(initialTests);
    const [students, setStudents] = useState(initialStudents);
    const [teachers, setTeachers] = useState(initialTeachers);
    const [teachersFormData, setTeachersFormData] = useState(initialTeachersFormData)
    const [teachersFormAlert, setTeachersFormAlert] = useState(initialTeachersFormAlert)
    const [me, setMe] = useState(data['me'])
    const [updatedProfile, setUpdatedProfile] = useState(updateProfileObject)
    const [updateProfileAlert, setUpdateProfileAlert] = useState(initialUpdateProfileAlert)
    const [editTest, setEditTest] = useState({ ...initialUploadTest })
    const [editTestAlert, setEditTestAlert] = useState(initialUploadTestAlert)
    const [automatedUploadTest, setAutomatedUploadTest] = useState({ ...initialUploadTest })
    const [automatedUploadTestAlert, setAutomatedUploadTestAlert] = useState(initialUploadTestAlert)
    const [manualUploadTest, setManualUploadTest] = useState({ ...initialUploadTest })
    const [manualUploadTestAlert, setManualUploadTestAlert] = useState(initialUploadTestAlert)

    const groupCallback = (value) => {
        setGroup(value);
    }

    const changeLoadingState = (value) => {
        setLoading(value);
    }

    const updateTests = (value) => {
        setTests(value);
    }

    const updateStudents = (value) => {
        setStudents(value);
    }

    const updateTeachers = (value) => {
        setTeachers(value);
    }

    const updateTeachersFormData = (value) => {
        setTeachersFormData(value);
    }

    const updateTeachersFormAlert = (value) => {
        setTeachersFormAlert(value);
    }

    const updateMe = (value) => {
        setMe(value);
    }

    const updateProfile = (value) => {
        setUpdatedProfile(value);
    }

    const updateProfileAlertCallback = (value) => {
        setUpdateProfileAlert(value);
    }

    const updateEditTest = (value) => {
        setEditTest(value);
    }

    const updateEditTestAlert = (value) => {
        setEditTestAlert(value);
    }

    const updateAutomatedUploadTest = (value) => {
        setAutomatedUploadTest(value);
    }

    const updateAutomatedUploadTestAlert = (value) => {
        setAutomatedUploadTestAlert(value);
    }

    const updateManualUploadTest = (value) => {
        setManualUploadTest(value);
    }

    const updateManualUploadTestAlert = (value) => {
        setManualUploadTestAlert(value);
    }

    useEffect(() => {
        if (tests.searchString === '') {
            setTests((tests) => ({ ...tests, filteredTests: data['get-quizzes(query-string-will-have-date-filters)'] }))
        } else {
            setTests((tests) => ({
                ...tests, filteredTests: data['get-quizzes(query-string-will-have-date-filters)'].filter((item) => {
                    if (Object.entries(item).some(([key, value]) => testSearchKeys.includes(key) && value.toLowerCase().includes(tests.searchString.toLowerCase()))) {
                        return item;
                    }
                })
            }))
        }
    }, [tests.searchString])

    useEffect(() => {
        if (students.searchString === '') {
            setStudents((students) => ({ ...students, allStudents: data['get-students/post-students'], recentStudents: data['get-recent-students'] }))
        } else {
            let filteredResults = data['get-students/post-students'].filter((item) => {
                if (Object.entries(item).some(([key, value]) =>
                    key === 'Subjects' && Object.keys(value).some((subject) => subject.toLowerCase().includes(students.searchString.toLowerCase())) || (studentSearchKeys.includes(key) && value.toString().toLowerCase().includes(students.searchString.toLowerCase())))) {
                    return item;
                }
            })
            setStudents((students) => ({ ...students, allStudents: filteredResults, recentStudents: filteredResults.filter((item) => students.recentStudents.some((recentItem) => recentItem.id === item.id)) }))
        }
    }, [students.searchString])

    // useEffect(() => {
    //     if (teachers.searchString === '') {
    //         setTeachers((teachers) => ({ ...teachers, allTeachers: data["get-teachers/post-teachers"] }))
    //     } else {
    //         setTeachers((teachers) => ({
    //             ...teachers, allTeachers: data["get-teachers/post-teachers"].filter((item) => {
    //                 if (Object.entries(item).some(([key, value]) => key === 'Subjects' && Object.keys(value).some((subject) => subject.toLowerCase().includes(teachers.searchString.toLowerCase())) || (teacherSearchKeys.includes(key) && value.toString().toLowerCase().includes(teachers.searchString.toLowerCase())))) {
    //                     return item;
    //                 }
    //             })
    //         }))
    //     }
    // }, [teachers.searchString])

    return (
        <dataContext.Provider
            value={{ group, groupCallback, loading, changeLoadingState, tests, updateTests, students, updateStudents, teachers, updateTeachers, teachersFormData, updateTeachersFormData, teachersFormAlert, setTeachers, updateTeachersFormAlert, me, updateMe, updatedProfile, updateProfile, updateProfileAlert, updateProfileAlertCallback, editTest, updateEditTest, editTestAlert, updateEditTestAlert, automatedUploadTest, updateAutomatedUploadTest, automatedUploadTestAlert, updateAutomatedUploadTestAlert, manualUploadTest, updateManualUploadTest, manualUploadTestAlert, updateManualUploadTestAlert }}
        >
            {children}
        </dataContext.Provider>
    )
}
export default DataContext;