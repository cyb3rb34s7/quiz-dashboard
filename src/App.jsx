import React, { useContext } from 'react'
import "./App.css"
import { dataContext } from './contexts/store'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { HelmetProvider } from 'react-helmet-async'
import moment from 'moment'
import NoMatch from '../src/screens/NoMatch'
import Navbar from '../src/components/Navbar'
import Dashboard from '../src/screens/dashboard/Dashboard'
import Upload from '../src/screens/upload/Upload'
import TestPreview from '../src/components/TestPreview'
import EditTest from '../src/screens/tests/EditTest'
import Tests from '../src/screens/tests/Tests'
import Teachers from '../src/screens/teachers/Teachers'
import TeacherProfile from '../src/screens/teachers/TeacherProfile'
import Students from '../src/screens/students/Students'
import StudentProfile from '../src/screens/students/StudentProfile'
import Profile from '../src/screens/profile/Profile'
moment.locale("en-in")

function App() {

  const { group } = useContext(dataContext)
  const isDesktop = useMediaQuery({ query: '(min-width: 1200px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 768px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  if (isDesktop || (isTablet && !isPortrait)) {
    return (
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navbar />} >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/upload/preview" element={<TestPreview />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/:name" element={<EditTest />} />
              {/* <Route path="/leads" element={<Leads />} />
                  <Route path="/leads/:name" element={<LeadProfile />}>
                    <Route index element={<LeadDetails />} />
                    <Route path="details" element={<LeadDetails />} />
                    <Route path="activities" element={<LeadActivities />} />
                    <Route path="*" element={<NoMatch />} />
                  </Route>
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/add-lead" element={<AddLead />} /> */}
              {group === "admin" &&
                <>
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/teachers/:name" element={<TeacherProfile />} />
                </>}
              <Route path="/students" element={<Students />} />
              <Route path="/students/:name" element={<StudentProfile />} />
              <Route path={`/profile`} element={<Profile />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    )
  } else if (isTablet && isPortrait) {
    return (
      <div className='rotate-device'>
        <div>
          <div></div>
        </div>
        <p>Please rotate your device to landscape mode</p>
      </div>
    )
  } else {
    return (
      <div className="mobile">
        {/* <img src={splash} alt="real estate scene" />
            <img src={mobilePng} alt="brahmastra - manifesting realty" />
            <a href='https://play.google.com/store/apps/details?id=com.pinaka.brahmastra&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
              <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' />
            </a> */}
      </div>
    )
  }
}

export default App