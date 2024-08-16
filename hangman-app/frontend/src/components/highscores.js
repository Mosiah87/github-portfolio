import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

const Record = (props) => (
 <tr>
   <td>{props.record.name}</td>
   <td>{props.record.wordLength}</td>
   <td>{props.remainGss}</td> {/* Use props.remainGss to display Strikes Remaining */}
 </tr>
);

export default function HighScoreList() {
 const [records, setRecords] = useState([]);
 const [selectedWordLength, setSelectedWordLength] = useState(3); // Set default word length to 3

 // This method fetches the records from the database.
 useEffect(() => {
   async function getRecords() {
     const response = await fetch(`http://localhost:5000/highscores/${selectedWordLength}`);
     if (!response.ok) {
       window.alert("failed in highscores.js UseEffect " + response.statusText);
       return;
     }
     const records = await response.json();
     setRecords(records);
   }
   getRecords();
 }, [selectedWordLength]); // Update records when selectedWordLength changes

 // This method will map out the records on the table
function HighScoreList() {
  const sortedRecords = records
    .filter(record => record.wordLength === selectedWordLength)
    .sort((a, b) => {
      const aRemain = 6 - a.incorrectGuessCt; 
      const bRemain = 6 - b.incorrectGuessCt;
      return bRemain - aRemain; 
    })
    .slice(0, 10) // Get only top 10 records
    .map(record => {
      const remainGss = 6 - record.incorrectGuessCt; 

      return (
        <Record 
          record={record}
          key={record.id}
          remainGss={remainGss} 
        />
      );
    });

  return sortedRecords;
}

 // Handle changing the selected word length
 const handleWordLengthChange = (length) => {
   setSelectedWordLength(length);
 };

 // This following section will display the table with the records of individuals.
 return (
   <div>
     <h1>High Scores</h1>
     <div style={{ marginBottom: "20px" }}>
       <div className="Length Categories" style={{ marginRight: "10px" }}>
          <h3>Word length:</h3>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(3)}>3</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(4)}>4</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(5)}>5</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(6)}>6</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(7)}>7</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(8)}>8</button>
          <button className="btn btn-primary" onClick={() => handleWordLengthChange(9)}>9</button>
       </div>
     </div>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Name</th>
           <th>Guessed Word Length</th>
           <th>Strikes Remaining</th>
         </tr>
       </thead>
       <tbody>{HighScoreList()}</tbody>
     </table>
     <Link to={"/"} className="btn btn-outline-primary" >Go Home</Link>
   </div>
 );
}
