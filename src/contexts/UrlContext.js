import React, { createContext, useState } from 'react'
export const SampleContext = createContext()
const SampleContextProvider = (props) => {
    const [variableOne, setVariableOne] = useState('somethingRandom')
    const Url = "https://440f142c.dv-mtn-capstone.pages.dev"
    return (
         <SampleContext.Provider 
            value={{
                variableOne,
                Url
             }}>
               {props.children}
         </SampleContext.Provider>
    )
}
export default SampleContextProvider