import React, { useState } from "react";
import { BsXLg } from "react-icons/bs";


function Button(props){

    const [btnStyle, setBtnStyle] = useState(false)

    function changeStyle(){
        const btnChange = !btnStyle
        setBtnStyle(btnChange)
    }

    function changeBack(){
        const btnChange = !btnStyle
        setBtnStyle(btnChange)
    }

    return <button onMouseOver={changeStyle} onMouseOut={changeBack}  style={btnStyle ? {
        backgroundColor: props.color,
        color: props.bgColor,
        border: "1px solid #1F2B6F",
        width: props.width,
        padding: props.padding
        // padding: "10px 15px"
    }
 : {
        backgroundColor: props.bgColor,
        color: props.color,
        width: props.width,
        padding: props.padding

        // padding: "10px 15px"
    }} onClick={(evt)=>{
        evt.preventDefault()
        props.submitData()
    }} className="btn-comp">{props.text}</button>
}



function LinkButton(props){

    const [btnStyle, setBtnStyle] = useState(false)

    function changeStyle(){
        const btnChange = !btnStyle
        setBtnStyle(btnChange)
    }

    function changeBack(){
        const btnChange = !btnStyle
        setBtnStyle(btnChange)
    }

    return <button onMouseOver={changeStyle} onMouseOut={changeBack}  style={btnStyle ? {
        backgroundColor: props.color,
        color: props.bgColor,
        border: "1px solid #1F2B6F",
        width: props.width,
        
    }
 : {
        backgroundColor: props.bgColor,
        color: props.color,
        width: props.width,
        // padding: "10px 15px"
    }} className="btn-comp">{props.text}</button>
}

function AlertButton(props){
    return <button  style={{
        backgroundColor: props.bgColor,
        color: props.color,
        width: props.width,
        marginBottom: "10px"
        }}
     className="btn-comp">{props.text} <BsXLg className="float-end" style={{marginTop: "5px"}}  onClick={(evt)=>{
        evt.preventDefault()
        props.clickClose()
        }}/>
        </button>
}




export { LinkButton, Button,  AlertButton }