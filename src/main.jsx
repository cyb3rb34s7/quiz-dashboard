import React from 'react'
import ReactDOM from 'react-dom/client'
import DataContext from './contexts/DataContext.jsx'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './index.css'
import './styles/Antd.css'
import { colors } from './constants/Constants.js'
import {Provider} from 'react-redux'
import store from './store/store.ts'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

const persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataContext>
      <Provider store = {store}>
        <PersistGate persistor={persistor}>
      <ConfigProvider
        theme={{
          token: {},
          components: {
            Empty: {
              colorTextDisabled: colors.secondaryTextColor,
            },
            DatePicker: {
              lineWidth: 0, // remove border
              controlOutlineWidth: 0, // remove outline
              controlPaddingHorizontal: '1rem', // control padding
              borderRadius: '5px', // border radius
              colorTextPlaceholder: colors.tertiaryTextColor, // placeholder color
              colorPrimary: colors.noGradientBackgroundColor, // selected background color
              colorPrimaryHover: 'none', // selected background color when hover
              colorLinkActive: colors.gradientStartColor, // selected background color when link active
              colorLinkHover: colors.gradientStartColor, // selected background color when link hover
              colorLink: colors.noGradientBackgroundColor, // selected background color when link
              // colorBgContainerDisabled: colors.quaternaryTextColor, // background color when disabled
              colorTextDisabled: colors.secondaryTextColor,
            },
          }
        }}
      >
        <App />
      </ConfigProvider>
      </PersistGate>
      </Provider>
    </DataContext>
  </React.StrictMode>,
)
