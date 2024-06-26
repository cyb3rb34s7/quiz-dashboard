import { useEffect, useContext, useState } from 'react'
import '../styles/Navbar.css'
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
// import { logout } from '../services/Auth';
import WithAuth from '../components/WithAuth';
import { dataContext } from '../contexts/store'
import { colors } from '../constants/Constants';
import { getInfo } from '../services/Teachers';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAdmin, setTeacherInfo } from '../store/teacherSlice';

function Navbar() {
  const { group } = useContext(dataContext);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch()
  const [teacherId, setTeacherId] = useState('')
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [])
  
  useEffect(() => {
    fetchInfo()
  },[])
  const fetchInfo = async() => {
    const profileInfo = await getInfo()
    // console.log(profileInfo)
    if(profileInfo){
      setTeacherId(profileInfo._id)
      dispatch(setTeacherInfo(profileInfo))
      dispatch(setIsAdmin(profileInfo.admin))
    }
  }
  return (
    <>
      <nav>
        <NavLink to='/' className='nav-item pv1 ph2 w100'>
        </NavLink>
        <NavLink to='/dashboard' className='nav-item pv1 ph2 w100'>
          Dashboard
        </NavLink>
        <NavLink to='/upload' className='nav-item pv1 ph2 w100'>
          Upload
        </NavLink>
        <NavLink to='/tests' className='nav-item pv1 ph2 w100'>
          Tests
        </NavLink>
          <NavLink to='/teachers' className='nav-item pv1 ph2 w100'>
            Teachers
          </NavLink>
        <NavLink to='/students' className='nav-item pv1 ph2 w100'>
          Students
        </NavLink>
        <NavLink to={`/profile`}  className='nav-item profile-nav-item pvhalf ph2 w100'>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.quaternaryTextColor}>
            <path d="M140-80q-24 0-42-18t-18-42v-480q0-24 18-42t42-18h250v-140q0-24 18-42t42.411-18h59.178Q534-880 552-862t18 42v140h250q24 0 42 18t18 42v480q0 24-18 42t-42 18H140Zm0-60h680v-480H570v30q0 28-18 44t-42.411 16h-59.178Q426-530 408-546t-18-44v-30H140v480Zm92-107h239v-14q0-18-9-32t-23-19q-32-11-50-14.5t-35-3.5q-19 0-40.5 4.5T265-312q-15 5-24 19t-9 32v14Zm336-67h170v-50H568v50Zm-214-50q22.5 0 38.25-15.75T408-418q0-22.5-15.75-38.25T354-472q-22.5 0-38.25 15.75T300-418q0 22.5 15.75 38.25T354-364Zm214-63h170v-50H568v50ZM450-590h60v-230h-60v230Zm30 210Z" />
          </svg>
          <br />
          Profile
        </NavLink>
      </nav>
      <main className='pv1 ph2'>
        <div id="date-picker-container"></div>
        <Outlet />
      </main>
    </>
  )
}
export default WithAuth(Navbar);