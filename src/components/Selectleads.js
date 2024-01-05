import React, {useEffect, useState} from 'react';
import { Button, AlertButton } from './Button';
import {states, industies} from "./helpers/states"
import OptionsProp from "./Optionsprop"
import axios from 'axios';
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
        

function Selectleads(){

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [dataBaseMsg, setDataBaseMsg] = useState({msg: "", color: ""})

    const [selectedStates, setSelectedStates] = useState(null);
    const [selectedIndustries, setSelectedIndustries] = useState(null);

    function validateForm(){
        let error = {}
        console.log(selectedStates)
        if (selectedStates === null){
            error.state = "Select one or more locations."
        }
        if (selectedIndustries === null){
            error.industry = "Select one or more industries."
        }
        console.log(error)
        setErrors(error)
    }

    function SubmitToDatabase(){
        console.log(errors)
        validateForm()
        setSubmitting(true)
    }

    useEffect(()=>{
        if (Object.keys(errors).length === 0 && submitting){
            let loc = []
            let ind = []
            selectedStates.map(val=> loc.push(val.state))
            selectedIndustries.map(val=> ind.push(val.industry))
            console.log(loc, ind)
            console.log({cookie: document.cookie, industies: ind, location: loc})
            axios.post('http://34.210.164.13:5000/selectleads', {cookie: document.cookie, industry: ind, location: loc})
            .then(dbResult=>{
                console.log(dbResult.data.user_id)
                setDataBaseMsg({msg: "Successfully Selected Leads.", color: 'success'})
                document.cookie = `${dbResult.data.user_id}; path=/dashboard`
                window.location.href = '/dashboard'
            })
            .catch(dbError=>{
                console.log(dbError.response.data.errors[0].message)
                const errorMsg = dbError.response.data.errors[0].message
                const fLetter =  errorMsg[0].toUpperCase()
                const msgCapitalized = `${fLetter}${errorMsg.slice(1)}`
                setDataBaseMsg({msg: msgCapitalized, color: 'error'})

            })
        }

    }, [errors])


  return (
    <div style={{margin: "8% auto"}} className="low-padding-container">
      <h1>
       Select Leads 
      </h1>
        <div className="flex justify-content-center">
          <div className="flex justify-content-center" style={{ width: '32vw' }} >   
            <Card>
                <form>
                    {/* DATABASE MSG */}
                    {submitting && dataBaseMsg.msg && <Message severity={dataBaseMsg.color} text={dataBaseMsg.msg}  className="border-primary w-full justify-content-start mb-2"  /> }

                    <p style={{textAlign: "left"}} className="ml-2">
                        We are going to generate leads for you. Begin by selecting all of the States and Industries that you would like to target.
                    </p>
                    <p  className="ml-2" style={{textAlign: "left"}} >You may select multiples based on your needs.</p>

                    {/* ERROR MSG */}
                    {submitting && errors.state && <Message severity="error" text={errors.state}   className="border-primary w-full justify-content-start mb-2"  /> }

                    <MultiSelect value={selectedStates} onChange={(e) => setSelectedStates(e.value)} options={states} optionLabel="state" 
                    placeholder="Select States" maxSelectedLabels={3} className="w-full mb-4" />
                    
                    {/* ERROR MSG */}
                    {submitting && errors.industry && <Message severity="error" text={errors.industry}   className="border-primary w-full justify-content-start mb-2"  /> }

                    <MultiSelect value={selectedIndustries} onChange={(e) => setSelectedIndustries(e.value)} options={industies} optionLabel="industry" placeholder="Select Industries" maxSelectedLabels={3} className="w-full mb-4" />

                    <Button submitData={SubmitToDatabase} bgColor='#30C2B0' color='white' width="100%" text="Submit" />
                </form>
            </Card>
        </div>
        </div>
    </div>
  );
}


export default Selectleads