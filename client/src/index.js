/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */
/* eslint-disable semi */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './reducers/store'
import { SocketProvider } from './context/socketContext'
import App from './App'
import './index.css'

// eslint-disable-next-line no-undef
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <SocketProvider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SocketProvider>
  </Provider>,
)
