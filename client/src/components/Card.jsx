import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';


function Card(prop){
    const [clicked,setClicked] = useState(false)
    const [checked, setChecked]=useState(false)
    function removeCard(){prop.removeCard(prop.id)}

    function changeChecked(){
        setChecked(!checked)
    }

    return <div className='note' >
    <input type='checkBox' onChange={changeChecked}></input>
    <p style={checked ? {textDecoration:'line-through'}: null}>{prop.txt}</p>
    <button className='deleteClass' onClick={removeCard}><DeleteIcon /></button>
    </div>
}   

export default Card