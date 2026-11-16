import { createContext, useContext } from 'react'

/** true once the preloader has finished (or was skipped), so hero animations can start. */
export const IntroContext = createContext(true)
export const useIntroDone = () => useContext(IntroContext)
