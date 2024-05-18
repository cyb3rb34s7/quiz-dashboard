import React, { useRef } from 'react'
import '../styles/FileUpload.css'
import { colors } from '../constants/Constants'

const FileUpload = ({ subject, filename = '', handleUpload, handleRemove }) => {
  
  const fileInputRef = useRef(null)

  return (
    <div className='col-6 file-upload-comp' key={subject}>
      <label htmlFor={subject}>{subject}</label><br />
      <input
        type="file"
        id={subject}
        name={subject}
        accept=".xlsx, .xls, .csv" 
        ref={fileInputRef}
        hidden
        onChange={(e) => {
          handleUpload(e)
          e.target.value = ''
        }}
      />
      <div className='mthalf d-flex-row justify-start align-center'>
        {filename && <input type='text' value={filename} disabled className='filename-container flex-1 ph1 br5 mrhalf' />}
        {filename ?
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.quaternaryTextColor} className='remove-icon br5 cp' style={{ background: 'red' }} onClick={() => handleRemove(subject)}>
            <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
          :
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.quaternaryTextColor} className='add-icon br5 cp' style={{ background: colors.secondaryTextColor }} onClick={() => fileInputRef.current.click()}>
            <path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" />
          </svg>}
      </div>
    </div>
  )
}

export default FileUpload