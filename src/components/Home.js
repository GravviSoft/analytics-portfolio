import React from 'react';
import Footer from './Footer';
import {Indextoprow, Indexmiddlerow, Indexbottomrow, Indextesterow} from './Indexbody';


function Home(){
    return     <div className="App">
        <Indextoprow />
        <Indexmiddlerow />
        <Indextesterow />
        <Indexbottomrow />
        <Footer />
    </div>
}


export default Home