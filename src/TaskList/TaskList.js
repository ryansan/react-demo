import React, {UseState, useEffect, useState} from 'react';
import Task from '../Task/Task';


function TaskList(props){

    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos")
        .then(res => res.json())
      .then(
        (result) => {

            result.map(item => ({
                id: item.id,
                title: item.title,
                completed: item.completed
            }))

            setTodos(result.map(item => ({
                id: item.id,
                title: item.title,
                completed: item.completed
            }))
            );

            //setTodos(result);
            console.log("result");
            console.log(todos);
        });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
            console.log("err");
            console.log(error);
        }
    );


    const tasks = [<Task name={"Buy groceries"}/>,<Task name={"Clean ur room"}/>,<Task name={"Wash the dishes"}/>];

    return (
        <div>
         {tasks.map((row, i) =>
         <p>{row}</p>
         )}
        </div>
    );
}

export default TaskList;

