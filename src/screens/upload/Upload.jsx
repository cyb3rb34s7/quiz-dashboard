import React, { useState } from 'react'
import AutomatedUpload from '../../components/AutomatedUpload'
import ManualUpload from '../../components/ManualUpload'
import { Button } from 'antd'

const Upload = () => {
  const [automation, openAutomation] = useState(false)
  return (
    <>
      <h1 className='page-heading fxlarge fbolder mb1'>Upload</h1>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 className='mv1 text-secondary mr2'>{!automation ? 'Automation coming soon' : 'Automated'}</h3>
        <Button onClick={() => openAutomation(!automation)}>
          {!automation ? 'Check Automation UI' : 'Close Automation UI'}
        </Button>
      </div>
      {automation &&(<AutomatedUpload />)}
      <h3 className='mv1 text-secondary'>Manual</h3>
      <ManualUpload />
    </>
  )
}

export default Upload