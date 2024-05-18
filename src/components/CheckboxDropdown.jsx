import React, { useState, useRef, useEffect } from 'react'
import '../styles/CheckboxDropdown.css'
import { colors } from '../constants/Constants'

const CheckboxDropdown = ({ nameOfLabel, checkOptions, selectedOptions, handleChange }) => {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

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

  return (
    <div className='checkbox-dropdown-container ps-relative' ref={dropdownRef}>
      <input type="text" className="form-input" ref={inputRef} style={{ cursor: "default" }} name={nameOfLabel} id={nameOfLabel} readOnly value={selectedOptions.join(", ")} onClick={() => setShow(!show)} /><br />
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.secondaryTextColor} onClick={() => inputRef.current.click()}>
        <path d="M480-360 280-560h400L480-360Z" />
      </svg>
      {show &&
        <div className='dropdown-menu bs br5 pvhalf w100 bg-white'>
          {checkOptions.map((option) => {
            return (
              <div className='dropdown-menu-item d-flex-row justify-center align-center ph1 cp' key={option}>
                <input
                  type="checkbox"
                  id={`${option}-checkbox`}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleChange(option)}
                  className='cp'
                />
                <label htmlFor={`${option}-checkbox`} className='mlhalf pvhalf flex-1 cp'>{option}</label>
              </div>
            )
          })}
        </div>}
    </div>
  )
}

export default CheckboxDropdown