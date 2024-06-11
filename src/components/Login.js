import React, { useEffect, useState } from "react";
import {Button} from "./Button";
import axios from "axios";
import { Password } from 'primereact/password'
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { baseUrl } from '../constants/globals';


function Login(){

  const [loginData, setLoginData] = useState({email: "", password: ""})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [dataBaseMsg, setDataBaseMsg] = useState({msg: "", color: ""})


  function updateForm(evt){
    const { value, name } = evt.target
    setLoginData(prev=>{
      return {
        ...prev,
        [name]: value
      }
    })
  }

  function handleErrors(formValues){
    let errors= {}
    let array_mails = formValues.email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    console.log(array_mails)
    if  (!array_mails){ 
      errors.email = "Enter a valid email."
    }
    if (formValues.password.length < 3){
      errors.password = "Enter a valid password"
    }
    setErrors(errors)
  }

  function SubmitToDatabase() {
      handleErrors(loginData)
      setSubmitting(true)

  }

  useEffect(()=>{
    console.log(errors)
    if (Object.keys(errors).length === 0 && submitting){
        axios.post(`${baseUrl}:5023/login`, loginData)
          .then(dbResult=>{
            const { user_id, industry } = dbResult.data.userInfo
            setDataBaseMsg({msg: "Successfully Login.", color: 'success'})
            industry === null ? window.location.href = "/selectleads" : window.location.href = "/dashboard"
            document.cookie = `${user_id}; path=/selectleads`
            document.cookie = `${user_id}; path=/dashboard`
            console.log(document.cookie)
          })
          .catch(dbErr=> {
            const { error } = dbErr.response.data
            setDataBaseMsg({msg: error, color: 'error'})
              }
          )}

  }, [errors])

      // useEffect(() => {
      //   // ...
      // }); // 🚩 No dependency array: re-runs after every render!
      // Object.keys(errors).length === 0 ? 
      //   axios.post('${baseUrl}:5023/login', loginData)
      //   .then(dbResult=>{
      //     console.log(dbResult)
      //     console.log(dbResult.data.userInfo.user_id)
      //     document.cookie = `${dbResult.data.userInfo.user_id}; path=${baseUrl}:3000/selectleads`
      //     window.location.href = "${baseUrl}:3000/selectleads";
      //     console.log(document.cookie)
      //   })
      //   .catch(err=> console.log(err))
      //   :
      //   console.log('Erroorrs arre prresent')

      // }

  function closeAlert(){ 
    setErrors({})
    setSubmitting(false)
  }
  return (
    <div className="low-padding-container">
        <h1>Login</h1>
        <div className="flex justify-content-center">
          <div className="card flex justify-content-center" style={{ width: '30vw' }} >   
            
            {/* DATABASE MSG */}
            {submitting && dataBaseMsg.msg && <Message severity={dataBaseMsg.color} text={dataBaseMsg.msg}  className="border-primary w-full justify-content-start mb-2"  /> }

            <form>

              {/* ERROR MSG */}
              {submitting && errors.email && <Message severity="error" text={errors.email}   className="border-primary w-full justify-content-start mb-1"  /> }
              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-at"></i>
                  </span>  
                  <InputText name="email" placeholder="Email" value={loginData.email} onChange={updateForm} />
              </div>


              <div className="p-inputgroup mb-4"> 
                  <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                  </span>  
                <Password name="password" placeholder="Password" value={loginData.password} onChange={updateForm} feedback={false} tabIndex={1} toggleMask/>

              </div>

              <div className="p-inputgroup mb-1"> 
                <Button submitData={SubmitToDatabase} bgColor='#30C2B0' color='white' width="100%" text="Submit" />
              </div>

            </form>
          </div>
        </div>
    </div>
  )
  // return (
  //   <div>
  //   <div className="formcontainer">
  //     <h1>
  //      Login 
  //     </h1>
  //     {(submitting && dataBaseMsg.msg) ? <AlertButton bgColor={dataBaseMsg.color} color='white' width="350px" text={dataBaseMsg.msg} clickClose={closeAlert}/> : null }
  //     <form>
  //       {(submitting && errors.email) ? <AlertButton bgColor='#ff5959' color='white' width="350px" text={errors.email} clickClose={closeAlert}/> : null }
        // <input name="email" placeholder="Email" value={loginData.email} onChange={updateForm} />
  //       {(submitting && errors.password) ? <AlertButton bgColor='#ff5959' color='white' width="350px" text={errors.password} clickClose={closeAlert}/> : null }
  //       <input name="password" placeholder="Password" value={loginData.password} onChange={updateForm} />
  //       <Button submitData={SubmitToDatabase} bgColor='#30C2B0' color='white' width="350px" text="Submit" />
  //     </form>
    
  //   </div>
  //   </div>
  // );
}

export default Login