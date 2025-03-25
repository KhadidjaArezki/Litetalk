import { createContext, useContext } from 'react'
import { initializeSocket } from '../socket/index'

const SocketContext = createContext()

export function SocketProvider({ store, children }) {
  const socket = initializeSocket(store)
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
