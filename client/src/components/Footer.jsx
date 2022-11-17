import React from 'react';

var year =new Date().getFullYear() 
function Footer(){
    return <footer><h1>Copyright {year}</h1></footer>
}

export default Footer