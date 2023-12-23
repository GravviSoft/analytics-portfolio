import React, {useState} from "react";
import { Button as PrimeButton }  from 'primereact/button';


function Note(props) {

  const [heartClick, setHeartClick] = useState(false)

  // function toggleHeart(){
  //   const setHeart = !heartClick
  //   console.log(setHeart)
  //   setHeartClick(setHeart)
  // }

  return (
    <div className="note">
     <div className="bottom-note">
      <h1>{props.title}</h1>
      <p>{props.date}</p>
     </div>
      {/* <h1>{props.title}</h1>
      <p>{props.date}</p> */}
      <p style={{size: "8px"}}>{props.content}</p>
      <div className="bottom-note">
        <div onClick={()=> props.toggleHeart(props.id, props.like_note)} style={props.like_note ? {animation: 'heart-burst .8s steps(28) forwards'} : null  } class="HeartAnimation"></div>
        <PrimeButton onClick={()=>{props.deleteNote(props.id)}} icon="pi pi-trash" rounded text severity="info" aria-label="Trash" />
      </div>
    </div>
  );
}

export default Note;