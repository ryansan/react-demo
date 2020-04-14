import React, { useState, useEffect } from 'react';
import './Task.css'

function Task(props) {

    const [id, setID] = useState (0);
    const [isFinished, setIsFinished] = useState(false);
    const [test, setTest] = useState("false");    

    function changeStatusHandler(value){
       setIsFinished(value);
       if(isFinished){
           setTest("True")
       }else{
           setTest("False")
       }
    };

    return (
        <div className="Task">
            <p>Task: {props.name}</p>
            <p>Finished: {test}</p>
            <button onClick={() => changeStatusHandler(!isFinished)}> Change status </button>            
        </div>
    );
}

export default Task;