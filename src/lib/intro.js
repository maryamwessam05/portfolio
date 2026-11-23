import { createContext, useContext } from 'react'

export const IntroContext = createContext(true)
export const useIntroDone = () => useContext(IntroContext)
