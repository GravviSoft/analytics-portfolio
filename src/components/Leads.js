import React, { useEffect, useState } from 'react';
// import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import CardDemo from './Leadspgcomp.js/Companycard';
import Navbar from './Navbar';
import CreateArea from "./Leadspgcomp.js/CreateArea";
import Note from './Leadspgcomp.js/Notes';
import { BreadCrumb } from 'primereact/breadcrumb';
import { getStatus } from './helpers/swithstatus';
      

function Leads(){

    let x = document.cookie
    let user_id = x.split(";")[0]
    const { pathname } = window.location
    console.log(pathname)
     
    const [knobValue, setKnobValue] = useState(null);

    const [lead, setLead] = useState({})
      
    const [rating, setRating] = useState(null);

    useEffect(()=>{
    console.log(knobValue)
    console.log("knobValue", knobValue)
      if (knobValue !== null){
        axios.patch(`${pathname}`, {status: getStatus(knobValue), status_num: knobValue})
        .then(dbResult=>{
          console.log(dbResult.data)
          setLead(dbResult.data)
          setKnobValue(null)
        })
        .catch(dbError=>{
          console.log(dbError)
          setKnobValue(null)
        })
      }
    }, [knobValue]) 

    

    useEffect(() => {
        axios.get(pathname)
          .then(dbResult=>{
            console.log(dbResult.data)
            setLead(dbResult.data)
          })
          .catch(dbError=>console.log(dbError))
    }, []);


    function Ratingset(e){
      console.log(e)
      setRating(e)
    }


    const items = [{ label: 'Lead Page' }];
    const home = { label: 'Dashboard', url: '/dashboard' }

    function setKnobValueFunc(value){
      console.log("setKnobValueFunc", value)
      setKnobValue(value)
    }

 return  <div className="App">
         <BreadCrumb model={items} home={home} />
          <CardDemo company_img={lead.company_img} company={lead.company} phone={lead.phone} industry={lead.industry} email={lead.email} status={lead.status} status_num={lead.status_num} setKnobValueFunc={setKnobValueFunc} rating={rating} setRating={Ratingset} />
    </div>
}


export default Leads