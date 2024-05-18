import React, { useContext } from 'react'
import '../styles/IconSelectModal.css'
import { dataContext } from '../contexts/store'
import { Modal } from 'antd'
import { colors, iconBgColor } from '../constants/Constants'

const iconPath = {
    biotech: <path d="M200-120v-60h208v-104h-15q-81 0-137-56t-56-137q0-61 35-111t92-70q4-40 35-65t72-22l-21-59 41-14.56L440-856l66-24 14 37 40-14 113 295-43 15 14 37-64 23-14-37-43 16-25-68q-15 17-35.5 24.5t-43.833 6.5Q393-546 371-561t-35-38q-35 17-55.5 49.965T260-477q0 55.417 38.792 94.208Q337.583-344 393-344h347v60H508v104h252v60H200Zm356-452 53-19-80-206-53 19 80 206Zm-130.175-23Q447-595 461.5-609.325q14.5-14.324 14.5-35.5Q476-666 461.675-680.5q-14.324-14.5-35.5-14.5Q405-695 390.5-680.675q-14.5 14.324-14.5 35.5Q376-624 390.325-609.5q14.324 14.5 35.5 14.5ZM556-572Zm-130-75Zm2 0Z" />,
    genetics: <path d="M200-40v-40q0-140 65-226t169-174q-104-88-169-174t-65-226v-40h60v40q0 11 .5 20.5T262-840h436q1-10 1.5-19.5t.5-20.5v-40h60v40q0 140-65 226T526-480q104 88 169 174t65 226v40h-60v-40q0-11-.5-20.5T698-120H262q-1 10-1.5 19.5T260-80v40h-60Zm120-640h320q16-23 27.5-47.5T687-780H273q8 28 19.5 52.5T320-680Zm160 161q31-26 59-50.5t52-50.5H369q24 26 51.5 50.5T480-519ZM369-340h222q-24-26-52-50.5T480-441q-31 26-59 50.5T369-340Zm-96 160h414q-8-28-19.5-52.5T640-280H320q-16 23-27.5 47.5T273-180Z" />,
    globe: <path d="M480.266-80q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80ZM480-140q142.375 0 241.188-99.5Q820-339 820-480v-13q-6 26-27.405 43.5Q771.189-432 742-432h-80q-33 0-56.5-23.5T582-512v-40H422v-80q0-33 23.5-56.5T502-712h40v-22q0-16 13.5-40t30.5-29q-25-8-51.357-12.5T480-820q-141 0-240.5 98.812Q140-622.375 140-480h150q66 0 113 47t47 113v40H330v105q34 17 71.7 26t78.3 9Z" />,
    psychology: <path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l55 218q4 14-5 25.5T853-360h-93v140q0 24.75-17.625 42.375T700-160H600v80h-60v-140h160v-200h114l-45-180q-24-97-105-158.5T480-820q-125 0-212.5 86.5T180-522.46q0 64.417 26.324 122.392Q232.649-342.092 281-297l19 18v199h-60Zm257-370Zm-48 76h60l3-44q12-2 22.472-8.462Q544.944-432.923 553-441l42 14 28-48-30-24q5-14 5-29t-5-29l30-24-28-48-42 14q-8.333-7.692-19.167-13.846Q523-635 512-638l-3-44h-60l-3 44q-11 3-21.833 9.154Q413.333-622.692 405-615l-42-14-28 48 30 24q-5 14-5 29t5 29l-30 24 28 48 42-14q8.056 8.077 18.528 14.538Q434-420 446-418l3 44Zm30.118-84Q450-458 429.5-478.382q-20.5-20.383-20.5-49.5Q409-557 429.382-577.5q20.383-20.5 49.5-20.5Q508-598 528.5-577.618q20.5 20.383 20.5 49.5Q549-499 528.618-478.5q-20.383 20.5-49.5 20.5Z" />,
    school: <path d="M479-120 189-279v-240L40-600l439-240 441 240v317h-60v-282l-91 46v240L479-120Zm0-308 315-172-315-169-313 169 313 172Zm0 240 230-127v-168L479-360 249-485v170l230 127Zm1-240Zm-1 74Zm0 0Z" />,
    science: <path d="M172-120q-41.777 0-59.388-39Q95-198 124-230l248-280v-270h-52q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T320-840h320q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T640-780h-52v270l248 280q29 32 11.388 71-17.611 39-59.388 39H172Zm-12-60h640L528-488v-292h-96v292L160-180Zm318-300Z" />,
}

const IconSelectModal = ({ isModalOpen, onOk, onCancel, handleSelect, uploadType }) => {
    const { automatedUploadTest, automatedUploadTestAlert, manualUploadTest, manualUploadTestAlert } = useContext(dataContext)
    return (
        <Modal
            title="Choose test icon"
            open={isModalOpen}
            onOk={onOk}
            onCancel={onCancel}
            centered
        >
            <>
                {uploadType === "manual" && manualUploadTestAlert.quizIcon && <div className='alert'>{manualUploadTestAlert.quizIcon}</div>}
                {uploadType === "automated" && automatedUploadTestAlert.quizIcon && <div className='alert'>{automatedUploadTestAlert.quizIcon}</div>}
                <div id="icon-select-modal" className='d-flex-row justify-sb align-start'>
                    {Object.keys(iconPath).map((pathKey) => (
                        <div className='d-flex-col justify-sb align-center' key={pathKey}>
                            <div
                                className='logo-icon-container br10 d-flex-row align-center justify-center bs cp mv1'
                                style={{ backgroundColor: iconBgColor[pathKey], transform: `scale(${uploadType === "manual" && manualUploadTest.quizIcon === pathKey || uploadType === "automated" && automatedUploadTest.quizIcon === pathKey ? 1.1 : 1})` }}
                                onClick={() => handleSelect(pathKey)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 -960 960 960" width="40" fill={colors.quaternaryTextColor}>
                                    {iconPath[pathKey]}
                                </svg>
                            </div>
                            {(uploadType === "manual" && manualUploadTest.quizIcon === pathKey) && <hr className="hr-break mhauto" />}
                            {(uploadType === "automated" && automatedUploadTest.quizIcon === pathKey) && <hr className="hr-break mhauto" />}
                        </div>
                    ))}
                </div>
            </>
        </Modal>
    )
}

export default IconSelectModal