import React, {useEffect, useState, useRef} from 'react';
import { Skeleton } from 'primereact/skeleton';
import { Rating } from 'primereact/rating';
import CreateArea from "./CreateArea";
import Note from './Notes';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Knob } from 'primereact/knob';


function CardDemo(props) {
    let x = document.cookie
    let user_id = x.split(";")[0]

    const [noteArray, setNoteArray] = useState([])
    const [noteSingle, setNoteSingle] = useState(null)
    const [saveNote, setSaveNote] = useState(false)

    const [deleteNote, setDeleteNote] = useState(false)
    const [deletNoteID, setDeleteNoteID] = useState(null)
    const [heartClick, setHeartClick] = useState(null)

    const toast = useRef(null);

    const { pathname } = window.location
    console.log(pathname)



// GETS AN ARRAY OF NOTES FROM DATABASE WHEN PAGE LOADS
    useEffect(() => {
        
        axios.post(`/notes/${pathname}`, {user_id, user_id})
          .then(dbResult=>{
            console.log(dbResult.data)
            setNoteArray(dbResult.data)
          })
          .catch(dbError=>console.log(dbError))
    }, []);



    // SAVES SINGLE NOTE TO DATABASE
    useEffect(()=>{
        if (saveNote){
            console.log(`Saving note to database:`, noteSingle)
            axios.post(pathname, noteSingle)
            .then(dbResult=>{
              // RETURN AN ARRAY OF NOTES FROM DATABASE
                setNoteArray(dbResult.data)
                setSaveNote(false)
                setNoteSingle(null)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: "Successfully Saved Note", life: 3000 });
            })
            .catch(dbError=>{
                setSaveNote(false)
                setNoteSingle(null)
                toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Saving New Lead.', life: 3000 });
            })
                
        }
    }, [saveNote])


    useEffect(()=>{
      if (deleteNote){
        axios.delete(`/notes${pathname}/${user_id}/${deletNoteID}`)
          .then(dbResult=>{
            // RETURN AN ARRAY OF NOTES FROM DATABASE
            setDeleteNoteID(null)
            setNoteArray(dbResult.data)
            setDeleteNote(false)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: "Successfully Deleted Note", life: 3000 });
          })
          .catch(dbError=>{
            setDeleteNoteID(null)
            setDeleteNote(false)
            toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Deleting Lead.', life: 3000 });
          })
      }
    }, [deleteNote])


    useEffect(()=>{
      console.log(heartClick)
        if (heartClick !== null){
          axios.patch(`/notes${pathname}/${user_id}/${deletNoteID}`, {like_note: heartClick})
          .then(dbResult=>{
            // RETURN AN ARRAY OF NOTES FROM DATABASE
            setDeleteNoteID(null)
            setHeartClick(null)
            setNoteArray(dbResult.data)
            // toast.current.show({ severity: 'success', summary: 'Successful', detail: "Successfully Deleted Note", life: 3000 });
          })
          .catch(dbError=>{
            setDeleteNoteID(null)
            setHeartClick(null)
            // toast.current.show({ severity: 'error', summary: 'Error',  detail: 'Error Deleting Lead.', life: 3000 });
          })
        }

    }, [heartClick])

  function addNoteToArray(noteInfo) {
    setNoteSingle(noteInfo)
    setSaveNote(true)
  } 

  function deleteNoteFunc(id){
    console.log(id)
    setDeleteNoteID(id)
    setDeleteNote(true)

  }


  function toggleHeart(id, like_note){
    console.log(id, like_note)
    const setHeart = !like_note
    console.log(setHeart)
    setHeartClick(setHeart)
    setDeleteNoteID(id)
  }

    return (
        
        <div className="card">
         <Toast ref={toast} />
            <div class="grid">
                <div class="col-2">
                      <img alt={props.company_img} src={props.company_img} className="shadow-2 border-round" style={{ width: '164px' }} />
                </div>
                <div class="col-7">
                    <h1 className='pl-3 mb-2'>{props.company}</h1>  
                        <h5 className='pl-3 mb-2'>{props.industry}</h5>
                        <div width="5rem" className="pl-3 mb-2">{props.phone}</div>
                        <div className="pl-3 mb-2">{props.email}</div>              </div>
                <div class="col-3">
                      <h3 className='flex justify-content-center '  style={{textTransform: "capitalize"}}>{props.status}</h3>
                      <Knob className='flex justify-content-center ' value={+props.status_num} step={20} onChange={(e) => props.setKnobValueFunc(e.value)} />
                </div>
            </div>
          <hr />
                <CreateArea  addNote={addNoteToArray} />
                <div className='flex justify-content-start align-left flex-wrap '>
                    {noteArray.map((item, index)=> <Note key={index} id={item.notes_id} date={item.date} title={item.title} content={item.content} toggleHeart={toggleHeart} like_note={item.like_note} deleteNote={deleteNoteFunc} /> )}
                </div>
        </div>
    );
}

export default CardDemo