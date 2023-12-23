import React from "react";
import { Link } from "react-router-dom";

const emojipedia = [
  {
    id: 1,
    emoji: "fa fa-envelope",
    name: "Pull",
    meaning: 
    "Looking for email addresses?  Look no further! Lead Factory builds your email marketing lists at the press of a button.  Email marketing is a solid tool for getting your brand, product, or service out there"  
    },
  {
    id: 2,
    emoji: "fa fa-check",
    name: "Validate",
    meaning: "For any business that uses email marketing, email verification is extremely important. Prevent sending to fake addresses, avoid wasting time and prevent email blacklisting."  
    },
  {
    id: 3,
    emoji: "fa fa-paper-plane",
    name: "Send",
    meaning:  "COMING SOON... Automated email marketing campaigns.  The best all-in-one email marketing CRM platform for reaching, tracking, and selling to your leads."
  }
];


const images = [{id:1,  class: 'imageslant', img: "https://mydecorative.com/wp-content/uploads/2021/09/roofing-contractor.jpg"},
{id:2,  class: 'imageslant2', img: "https://www.cttech.org/wp-content/uploads/2022/07/IMG_3861-scaled.jpg"},
{id:3,  class: 'imageslant', img: "https://www.thespruce.com/thmb/Iu5eW0eKE6xZ1ThA_b2YS5rw6fI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/RigidPlankFlooring-bcb7f3f1e4374d018211f8913a815cdf.jpg"},
{id:4,  class: 'imageslant2', img: "https://media.istockphoto.com/id/103964310/photo/laying-sod-for-new-lawn.jpg?s=612x612&w=0&k=20&c=EkqJb3U6V3bjUW5cZkpSZcdfwLUEgcjdN31AFXV8sVc="},
{id:5,  class: 'imageslant', img: "https://www.bankrate.com/2022/05/31085355/what-is-a-realtor.jpg?auto=webp&optimize=high&crop=16:9"},
{id:6,  class: 'imageslant2', img: "https://teagueelectric.com/wp-content/uploads/2022/09/trained-electrician.jpg"},
{id:7,  class: 'imageslant', img: "https://production-next-images-cdn.thumbtack.com/i/302055749218885811/width/640.jpeg"},
{id:8,  class: 'imageslant2', img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtGFxcmP872RD8J9mrMOLg6YIUCGXtBEz3uuF2d89KYmL2m5iX704pgVtJGVbicMD0U-g&usqp=CAU"},
{id:9,  class: 'imageslant', img: "https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/featured-image-pool-contractor.jpeg.jpg"},
{id:10,  class: 'imageslant2', img: "https://www.hoamanagement.com/wp-content/uploads/2014/08/HOA-Attorneys-%E2%80%93-Why-They-Are-Important-And-How-To-Find-One.jpg"},
{id:11,  class: 'imageslant', img: "https://lakeelsinoredentistry.com/wp-content/uploads/general-dentistry-img.jpg"},
{id:12,  class: 'imageslant2', img: "https://katebuyshomes.com/wp-content/uploads/2019/02/home-loan-Broker.jpg"},
{id:13,  class: 'imageslant', img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwgMLrLdRcOPnUNToyxJ2FGrDoLQFvdikxtnUnYqZX2QEXUImhjXeua0T_AacaEM8cSY8&usqp=CAU"},]



function Imageslanting(props){
    return  <img className={props.class} alt="" src={props.img} />          
}


function Inforectangle(props) {
  return (
    <dl className="dictionary">
      <div className="rectangle">
        <dt>
          <span className="emoji" role="img" >
            <i class={props.emoji} aria-hidden="true"></i>
          </span>
          <span>{props.name}</span>
        </dt>
        <dd>{props.meaning}</dd>
      </div>
    </dl>
  );
}

function Smallinforectangle(props) {
  return (
    <dl className="dictionary">
      <div className="smallrectangle">
        <dt>
          <span>{props.name}<Link to="/selectleads"><i  style={{color: "#7ed0f6", backgroundColor: "transparent", textDecoration: "none"}} className={props.emoji} aria-hidden="true"></i></Link></span>
           <hr style={{color: "#7ed0f6"}} />
        </dt>
        <dt><dt className="float-start" style={{color: "#1f2b6f"}}>{props.num}</dt><span className="float-start" style={{color: "black"}}>{props.number}</span></dt>
        <dd>{props.meaning}</dd>
        {props.button}
      </div>
    </dl>
  );
}


function Infoblock(props) {
  return (
    <dl className="dictionary">
      <div  className="block">
        <dt>
          <span className="emoji" role="img" >
            <i class={props.emoji} aria-hidden="true"></i>
          </span>
          <span>{props.name}</span>
        </dt>
        <dd>{props.meaning}</dd>
      </div>
    </dl>
  );


}

function PasswordRequirements(){
     return <span className="pass-span">
      <ul>
        <label style={{fontSize: "18px"}}>Password Requirements</label>
          <li>6 char min.</li>
          <li>1 special char.</li>
          <li>Uppercase letter</li>
          <li>Lowercase letter</li>
        </ul>
    </span>
}





export {Smallinforectangle, Inforectangle, Infoblock, emojipedia, Imageslanting, images, PasswordRequirements};