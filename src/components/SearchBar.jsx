import React from 'react'
import '../styles/SearchBar.css'
import { colors } from '../constants/Constants'

const SearchBar = ({ valueString = '', handleChange }) => {
    return (
        <div className='search-bar bs bg-white d-inline-flex-row align-center br5 mr1 ps-relative'>
            <input
                type="text"
                placeholder="Search"
                className="search-input br5 w100"
                value={valueString}
                onChange={(e) => handleChange(e.target.value)}
            />
            {valueString.length <= 0 ?
                <span className='icon-container bg-primary br-circle text-center d-flex-row align-center justify-center cp'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill={colors.quaternaryTextColor}>
                        <path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" />
                    </svg>
                </span>
                :
                <span className='icon-container br-circle text-center d-flex-row align-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill={colors.primaryTextColor} onClick={() => handleChange('')} className='cp'>
                        <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                    </svg>
                </span>}
        </div >
    )
}

export default SearchBar