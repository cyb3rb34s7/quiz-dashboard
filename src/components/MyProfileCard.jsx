import { useState, useRef, useEffect, useContext } from 'react'
import '../styles/MyProfileCard.css'
// import raja from '../assets/raja.jpg'
import { logout } from '../services/Auth'
import blankPic from '../assets/blank-profile-picture.png'
import { colors } from '../constants/Constants'
import { useMediaQuery } from 'react-responsive'
import { dataContext } from '../contexts/store'
import { useSelector } from 'react-redux'
import Icon from './Icon'

const MyProfileCard = ({ editMode, handleEdit }) => {
    const { teacherInfo}  = useSelector((state) => state.teacher)
  
    const mediumScreen = useMediaQuery({ query: '(min-width: 992px)' })
    const { me, updatedProfile, updateProfile, updateProfileAlert, updateProfileAlertCallback } = useContext(dataContext)
    const [selectedPic, setSelectedPic] = useState(updateProfile['profilePicture'] ? updateProfile['profilePicture'] : '')
    const [show, setShow] = useState(false)
    const dropdownRef = useRef(null)
    const fileInputRef = useRef(null)
    const inputStyle = {
        borderBottom: editMode ? `1px solid ${colors.secondaryTextColor}` : 'none'
    }
   useEffect (()=> {
    updateProfile((updatedProfile) => ({...updatedProfile,
    first_name: teacherInfo.first_name,
    last_name: teacherInfo.last_name,
    phone: teacherInfo.phone,
    email: teacherInfo.email,
    profilePicture: ""
    }))
   },[])
    const handleFileInputChange = (event) => {
        updateProfile((updatedProfile) => ({ ...updatedProfile, profilePicture: event.target.files[0] }))
        setSelectedPic(URL.createObjectURL(event.target.files[0]))
    }

    const handleRemovePic = () => {
        setShow(false)
        updateProfile((updatedProfile) => ({ ...updatedProfile, profilePicture: 'remove' }))
        setSelectedPic(blankPic)
        // console.log("Remove pic")
    }

    const handleUploadPic = () => {
        setShow(false)
        fileInputRef.current.click()
        // console.log("Upload pic")
    }

    const handleEditClick = () => {
        handleEdit(true)
    }

    const handleProfilePicClick = () => {
        if (editMode) {
            setShow(!show)
        }
    }

    const handleChange = (e) => {
        updateProfile((updatedProfile) => ({ ...updatedProfile, [e.target.name]: e.target.value }))
    }

    const saveDetails = () => {
        if (validateForm()) {
            handleEdit(false)
            // console.log("Save details")
        }
    }

    const validateForm = () => {
        let valid = true
        if (updatedProfile.first_name === '') {
            updateProfileAlertCallback((prev) => ({ ...prev, first_name: 'First name cannot be empty' }))
            valid = false
        }
        if (updatedProfile.last_name === '') {
            updateProfileAlertCallback((prev) => ({ ...prev, last_name: 'Last name cannot be empty' }))
            valid = false
        }
        if (updatedProfile.phone === '') {
            updateProfileAlertCallback((prev) => ({ ...prev, phone: 'Phone number cannot be empty' }))
            valid = false
        }

        if (updatedProfile.phone.match(/^\d{10}$/) === null) {
            updateProfileAlertCallback((prev) => ({ ...prev, phone: 'Please enter a valid 10 digit phone number' }))
            valid = false
        }
        return valid
    }

    useEffect(() => {
        if (updatedProfile.first_name !== '') {
            updateProfileAlertCallback((prev) => ({ ...prev, first_name: '' }))
        }
        if (updatedProfile.last_name !== '') {
            updateProfileAlertCallback((prev) => ({ ...prev, last_name: '' }))
        }
        if (updatedProfile.phone !== '' && updatedProfile.phone.match(/^\d{10}$/) !== null) {
            updateProfileAlertCallback((prev) => ({ ...prev, phone: '' }))
        }
    }, [updatedProfile.first_name, updatedProfile.last_name, updatedProfile.phone])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && show) {
                // Clicked outside the dropdown, so close it
                setShow(false);
            }
        }

        // Add a click event listener to the document
        document.addEventListener('click', handleClickOutside);

        // Remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    })

    // console.log(updatedProfile)

    return (
        <>
            <div className={`card mt1 my-profile-card d-flex-row`}>
            {selectedPic ?
                (<div className="card-logo ml1 mvhalf d-flex-row justify-center align-center ps-relative" ref={dropdownRef}>
                    <input
                        type="file"
                        accept="image/*" // Restrict to image files (you can adjust this)
                        ref={fileInputRef}
                        hidden
                        onChange={handleFileInputChange}
                    />
                    <div
                        className='logo-icon-container br10 d-flex-row align-center justify-center bs ps-relative'
                        style={editMode ? { cursor: 'pointer' } : {}}
                        onClick={() => handleProfilePicClick()}
                    >
                        <img src={selectedPic} alt="Raja" className='logo-icon w100 h100 br10' style={editMode ? { filter: 'brightness(75%)' } : {}} />
                        {editMode && <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.quaternaryTextColor}>
                            <path d="M772-603 602-771l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829-660l-57 57Zm-58 59L290-120H120v-170l424-424 170 170Z" />
                        </svg>}
                    </div>
                    {show && <div className='dropdown-menu pvhalf br5 bg-white bs'>
                        <div className="dropdown-menu-item phalf cp" onClick={() => handleRemovePic()}>Remove</div>
                        <div className="dropdown-menu-item phalf cp" onClick={() => handleUploadPic()}>Upload</div>
                    </div>}
                </div>):
                <Icon icon={updatedProfile.first_name+ ' ' +updatedProfile.last_name} />}
                <div className="card-content d-grid-cols twelve-columns pl2 mvhalf flex-1">
                    <div className={`card-item col-${mediumScreen ? 4 : 6} d-grid-cols twelve-columns gap0 pvhalf`}>
                        <label className="card-item-label label-primary col-4 mvauto" htmlFor='first_name'>First Name</label>
                        <input className="card-item-value col-8 mr1 f600" type='text' name='first_name' id='first_name' value={updatedProfile.first_name} disabled={!editMode} onChange={handleChange} style={inputStyle} />
                        {updateProfileAlert.first_name && <div className='alert mthalf col-12 text-right pr1'>{updateProfileAlert.first_name}</div>}
                    </div>
                    <div className={`card-item col-${mediumScreen ? 4 : 6} d-grid-cols twelve-columns gap0 pvhalf`}>
                        <label className="card-item-label label-primary col-4 mvauto" htmlFor='last_name'>Last Name</label>
                        <input className="card-item-value col-8 mr1 f600" type='text' name='last_name' id='last_name' value={updatedProfile.last_name} disabled={!editMode} onChange={handleChange} style={inputStyle} />
                        {updateProfileAlert.last_name && <div className='alert mthalf col-12 text-right pr1'>{updateProfileAlert.last_name}</div>}
                    </div>
                    <div className={`card-item col-${mediumScreen ? 4 : 6} d-grid-cols twelve-columns gap0 pvhalf`}>
                        <div className="card-item-label label-primary col-4 mvauto">Email</div>
                        <div className="card-item-value col-8 mr1 f600 mvauto">{teacherInfo.email}</div>
                    </div>
                    <div className={`card-item col-${mediumScreen ? 4 : 6} d-grid-cols twelve-columns gap0 pvhalf`}>
                        <label className="card-item-label label-primary col-4 mvauto" htmlFor='phone'>Phone</label>
                        <input className="card-item-value col-8 mr1 f600" type='text' name='phone' id='phone' value={updatedProfile.phone} disabled={!editMode} onChange={handleChange} style={inputStyle} />
                        {updateProfileAlert.phone && <div className='alert mthalf col-12 text-right pr1'>{updateProfileAlert.phone}</div>}
                    </div>
                    <div className={`card-item col-${mediumScreen ? 4 : 6} d-grid-cols twelve-columns gap0 pvhalf`}>
                    {Object.entries(teacherInfo['subjects']).map(([course, subjects], index) => (
                        <div key={course + index}>
                        <div className="card-item-label label-primary col-4 mvauto">{course}</div>
                            <div className="card-item-value col-8 mr1 f600 mvauto">
                            <select>
                                {subjects.map((subject, index) => (
                                <option key={index} value={subject}>{subject}</option>
                                ))}
                            </select>
                            </div>
                            </div>
                    ))}
                    </div>


                    {updateProfileAlert.general && <div className='card-item col-12 pvhalf alert text-center'>{updateProfileAlert.general}</div>}
                </div>
                {!editMode &&
                    <div className="edit-card-content d-flex-row justify-center align-center pr1">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" onClick={() => handleEditClick()} className='cp'>
                            <defs>
                                <linearGradient id="iconGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="10%" stopColor={colors.gradientEndColor} stopOpacity={1} />
                                    <stop offset="80%" stopColor={colors.gradientStartColor} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <path d="M180-12q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h405l-60 60H180v600h600v-348l60-60v408q0 24-18 42t-42 18H180Zm300-360Zm182-352 43 42-285 284v86h85l286-286 42 42-303 304H360v-170l302-302Zm171 168L662-724l100-100q17-17 42.311-17T847-823l84 85q17 18 17 42.472T930-654l-97 98Z" fill="url(#iconGradient)" />
                        </svg>
                    </div>
                }
            </div>
            <div className='text-right pt1'>
                {editMode ?
                    <button className='btn' onClick={() => saveDetails()}>Save</button>
                    : <button className='btn' onClick={() => logout()}>Logout</button>}
            </div>
        </>
    )
}

export default MyProfileCard