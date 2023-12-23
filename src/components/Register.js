import React, {useEffect, useState} from "react";
import {Button, AlertButton} from "./Button";
import axios from "axios";
import {PasswordRequirements} from "./Infoblock"

import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { Tooltip } from 'primereact/tooltip';

function Register(){

    const [formInfo, setFormInfo] = useState({fName: "", lName: "", email: "", password:  ""})
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [dataBaseMsg, setDataBaseMsg] = useState({msg: "", color: ""})

    function updateForm(evt){
        const {value, name} = evt.target
        setFormInfo(prev=>{
            return {
                ...prev,
                [name]: value
            }
        })
    }

    function validateForm(formValues){
      let errors = {}
      if (formValues.fName.length < 1){
        errors.fName = "First name is required"
      }
      if (formValues.lName.length < 1){
        errors.lName = "Last name is required"
      }
      let array_mails = formValues.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
      console.log(array_mails)
      if  (!array_mails){ 
        errors.email = "Enter a valid email."
      }
      if (formValues.password.length < 6){
          errors.password = "Enter a longer password"
      } 
      const spec_char = formValues.password.match(/\W|_/g)
      const lower = formValues.password.match(/[a-z0-9]/g)
      const upper = formValues.password.match(/[A-Z0-9]/g)
      
      if  (!spec_char){ 
          errors.special = `Need spec. char.`
      }
      if  (!lower){ 
         errors.lower = `Need lower case.`
      }
      if  (!upper){ 
        errors.upper = `Need upper case`
      }     
      setErrors(errors)
    }

    const submitToDatabase = () => {
      validateForm(formInfo)
      console.log(errors)
      setSubmitting(true)
    };

    useEffect(() => {
      if (Object.keys(errors).length === 0 && submitting) {
          axios.post('http://localhost:5000/register', formInfo)
          .then(dbResult=>{
            console.log(dbResult)
            setDataBaseMsg({msg: "Successfully Registered.", color: 'success'})
            window.location.href = '/login'
      
          })
          .catch(dbError=>{
            console.log(dbError.response.data.errors[0].message)
            const errorMsg = dbError.response.data.errors[0].message
            const fLetter =  errorMsg[0].toUpperCase()
            const msgCapitalized = `${fLetter}${errorMsg.slice(1)}`
            setDataBaseMsg({msg: msgCapitalized, color: 'error'})

          })
         console.log(formInfo);
      }
    }, [errors]);



  return (
    <div className="low-padding-container">
        <h1>Register</h1>
        <div className="flex justify-content-center">
          <div className="card flex justify-content-center" style={{ width: '30vw' }} >   
            
            {/* DATABASE MSG */}
            {submitting && dataBaseMsg.msg && <Message severity={dataBaseMsg.color} text={dataBaseMsg.msg}  className="border-primary w-full justify-content-start mb-2"  /> }

            <form>
              {/* ERROR MSG */}
              {submitting && errors.fName && <Message severity="error" text={errors.fName}  className="border-primary w-full justify-content-start mb-1"  /> }
              
              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                  </span>  
                  <InputText  name="fName" placeholder="First Name" value={formInfo.fName} onChange={updateForm} />
              </div>

              {/* ERROR MSG */}
              {submitting && errors.lName && <Message severity="error" text={errors.lName}  className="border-primary w-full justify-content-start mb-1"  /> }
              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                  </span>  
                  <InputText name="lName" placeholder="Last Name" value={formInfo.lName} onChange={updateForm} />
              </div>

              {/* ERROR MSG */}
              {submitting && errors.email && <Message severity="error" text={errors.email}   className="border-primary w-full justify-content-start mb-1"  /> }
              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-at"></i>
                  </span>  
                  <InputText name="email" placeholder="Email" value={formInfo.email} onChange={updateForm}  />
              </div>

              {/* ERROR MSG */}
              {submitting && errors.password && <Message severity="error" text={errors.password}  className="border-primary w-full justify-content-start mb-1"  /> }
              {submitting && errors.special && <Message severity="error" text={errors.special}  className="border-primary w-full justify-content-start mb-1"  /> }
              {submitting && errors.lower && <Message severity="error" text={errors.lower}  className="border-primary w-full justify-content-start mb-1"  /> }
              {submitting && errors.upper && <Message severity="error" text={errors.upper}  className="border-primary w-full justify-content-start mb-1"  /> }

              <Tooltip target=".tooltip-button" autoHide={true}>
                      <ul style={{listStyleType: "none"}}>
                        <label style={{fontSize: "18px"}}>Password Requirements</label>
                          <li>6 char min.</li>
                          <li>1 special char.</li>
                          <li>Uppercase letter</li>
                          <li>Lowercase letter</li>
                        </ul>
                </Tooltip>
              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                  </span>  
                <Password name="password" placeholder="Password" className="tooltip-button"  value={formInfo.password} onChange={updateForm}  toggleMask/>
              </div>

              <div className="p-inputgroup mb-1"> 
                <Button submitData={submitToDatabase} bgColor='#30C2B0' color='white' width="100%" text="Submit" />
              </div>

            </form>
          </div>
        </div>
    </div>
  );
  
}

export default Register