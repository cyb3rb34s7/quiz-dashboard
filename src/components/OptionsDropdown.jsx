import React, { useState, useRef, useEffect } from 'react'
import '../styles/OptionsDropdown.css'
import { colors } from '../constants/Constants'

const OptionsDropdown = ({ nameOfLabel, dropOptions, selectedOption, handleChange, placeholder = '', disabled = false }) => {
    const [show, setShow] = useState(false)
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)

    const handleSelect = (option) => {
        handleChange(option)
        setShow(false)
    }

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
            <input
                type="text"
                className="form-input"
                ref={inputRef}
                style={{ cursor: "default" }}
                name={nameOfLabel}
                id={nameOfLabel}
                readOnly
                value={selectedOption}
                disabled={disabled}
                onClick={() => setShow(!show)}
                placeholder={placeholder}
            />
            <br />
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                fill={colors.secondaryTextColor}
                onClick={() => inputRef.current.click()}
            >
                <path d="M480-360 280-560h400L480-360Z" />
            </svg>
            {show &&
                <div className='dropdown-menu bs br5 pvhalf w100 bg-white'>
                    {dropOptions.map((option) => {
                        return (
                            <div
                                key={option}
                                className='dropdown-menu-item pvhalf ph1 cp'
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </div>
                        )
                    })}
                </div>}
        </div>
    )
}

export default OptionsDropdown