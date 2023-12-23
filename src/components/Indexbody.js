import React from "react";
import googyptodash from "../images/googyptodash.png";
import analytics from '../images/analytics.png'
import yellowpg from '../images/yellop.png'
import { Link } from "react-router-dom";
import {LinkButton} from "./Button";
import { Inforectangle, Infoblock, emojipedia, Imageslanting, images} from "./Infoblock";

function Indextoprow() {
  return (
    <div  id="index-row-1"  className="sideby">
        <div className="l-side col-sm-4">
              <Inforectangle  name="Lead Generation Tool" meaning="Leads at your fingertips. At the press of a button pull leads from google and yellow pages into your own database."/>
        </div>
        <div className="col-sm-7">
          <img src={googyptodash} alt="" className="googletodash" />
        </div>
    </div>
  );
}


function Indexmiddlerow() {
  return (
    <div id="index-row-2"  className="sideby">      
        <div className="col-sm-6">
            <img className="analyticsimg" alt="" src={analytics}  />
        </div>
        <div class="l-side col-sm-5">
            <Inforectangle  name="Visual Data Analytics" meaning="All leads are pulled in real time.  Say goodbye to companies giving you old data.  Along with fresh up-to-date leads, we also provide a dashboards with real-time data analytics."/>
        </div>     
    </div>
  );
}

function Indexbottomrow(){
  return <div className="rowcontainer">
          <h1  style={{margin: '5%'}}>Many Industries To Choose From</h1>
            <Link to="/register"> <LinkButton bgColor="#1f2b6f" color="white" width="450px" text="Register" /></Link>
          <div id="imagemove" className="sideby">
              {images.map(items=> <Imageslanting key={items.id} class={items.class} img={items.img} />)}
          </div>
          <img id="yellowpg" alt="" src={yellowpg} />
      </div>
}

function Indextesterow() {
  return (
    <div id="index-row-test"  className="sideby">     
      {emojipedia.map(items => <Infoblock key={items.id} emoji={items.emoji} name={items.name} meaning={items.meaning} />)}
    </div>
  );
}


export { Indextoprow, Indexmiddlerow, Indexbottomrow, Indextesterow }