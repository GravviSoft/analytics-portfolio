import React from 'react';

const d = new Date();
let year = d.getFullYear();

function Footer() {
  return (
    <footer>
      <p>Beau Enslow Capstone | Copyright {year}</p>

    </footer>
  );
}


export default Footer 
