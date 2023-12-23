import React, {useEffect, useState} from "react";

function CreateArea(props) {

  const [noteInfo, setNoteInfo] = useState({title: "", content: "", date: ""})
  const [submitting, setSubmitting] = useState(false)
    // const [date, setDate] = useState(null)
  const date = new Date();
  // console.log(date.toLocaleDateString());
  let x = document.cookie
  let user_id = x.split(";")[0]

  // useEffect(()=>{
  //   if (submitting){
  //     setNoteInfo(prev=>{
  //       return {
  //         ...prev,
          // user_id: user_id,
          // date: date.toLocaleDateString()
  //       }
  //     })
  //     setSubmitting(false)
  //   }


  // }, [submitting])


  function createNote(evt) {
    const {value, name} = evt.target
    setNoteInfo(prev=>{
      return {
        user_id: user_id,
        ...prev,
        [name]: value,
        date: date.toLocaleDateString()
      }})
  }


  return (
    <div>
      <form className="note-form">
        <input name="title" placeholder="Title" value={noteInfo.title} onChange={createNote} />
        <textarea name="content" placeholder="Take a note..." rows="3" value={noteInfo.content} onChange={createNote}/>
        <button onClick={(evt)=>{
          evt.preventDefault()
          // setSubmitting(true)
          props.addNote(noteInfo)
          setNoteInfo({title: "", content: "", date:  ""})
        }} className="addbtn" >Add</button>
      </form>
    </div>
  );
}

export default CreateArea;