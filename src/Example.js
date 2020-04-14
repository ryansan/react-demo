import React, { useState } from 'react';

function Example(props) {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const id = props.id;

  console.log(id);


  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Example;