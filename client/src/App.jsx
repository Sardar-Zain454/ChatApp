import React, { useEffect } from 'react';

let App = (props) => {
     
   
    useEffect(()=>{
        console.log("INSIDE");
    }, []);

   
    return (
        <>
         <h1 style={{textAlign: 'center', fontSize: "60px", background: "crimson"}}>{props.text}</h1>
        </>
    )

}

export default App;