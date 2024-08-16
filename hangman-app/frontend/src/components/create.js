import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Create() {
 const [form, setForm] = useState({
   name: "",
   number: 0,
   guessCt: 0,
 });
 const navigate = useNavigate();
  // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
  
    const newPerson = { ...form };
  
    try {
      const response = await fetch("http://localhost:5000/newWord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPerson),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create record');
      }
  
      const data = await response.json();
      const newRecordId = data.insertedId; // Assuming MongoDB returns the ID as "insertedId"
      const wordLength = data.wordLength;
      
      console.log("Generated new user, " + newRecordId);

      // Now navigate to the game page with the newly created record's ID
      navigate(`/game/${newRecordId}/${wordLength}`);
    } catch (error) {
      window.alert(error.message);
    }
    
    setForm({ name: "", number: "", guessCt: 0 });
  }
  
 
  // This following section will display the form that takes the input from the user.
 return (
   <div>
    <h2>Hangman Game</h2>
     <h5>Try to guess a random word without guessing incorrect letters!</h5>
     <br></br>
     <h3>Please enter your name</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       
       <div className="form-group">
         <input
           type="submit"
           value="Start guessing"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}