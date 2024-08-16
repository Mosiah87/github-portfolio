import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import FetchSessionRedirect from "./fetchSession";


function capFstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Transaction(props) {
  const date = new Date(props.record.dateTime);

  return (
  <tr>
    <td>{capFstLetter(props.record.transferType)}</td>
    <td>{props.record.fromAccount || "N/A"}</td>
    <td>{props.record.toAccount || "N/A"}</td>
    <td>${Number(props.record.transferAmount.$numberDecimal).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
    <td>{date.toLocaleString()}</td>
  </tr>
  );
};

export default function TransactionHistory() {
  

  const sessionUser = FetchSessionRedirect(false, '/failedLogin');
  useEffect(() => {
    async function fetchUser() {
      if(sessionUser){
        const response = await fetch(`http://localhost:5000/${sessionUser}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
      }
    }
    fetchUser();
  }, [sessionUser]);


const [transactionType, setTransactionType] = useState([]);
const [accountType, setAccountType] = useState("");
const params = useParams();
useEffect(() => {
  async function getTransactionType() {
    const response = await fetch(`http://localhost:5000/history/${params.type.toString()}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }
  const transactionType = await response.json();
    setTransactionType(transactionType);
    setAccountType(capFstLetter(params.type.toString()));
  }
  getTransactionType();
  return;
}, [params.type]);

function transactionHistory() {
  return transactionType.map((transactionType) => {
    return (
      <Transaction
        record={transactionType}
      />
    );
  });
}



return (
  <div className="container">
    <nav className="navbar">
      <div className="container-fluid">
        <Link to={"/home"} className="btn btn-outline-success">Account Home</Link>
      </div>
    </nav>
   <h3>{accountType} Transaction History</h3>
   <table className="table table-striped" style={{ marginTop: 20 }}>
     <thead>
       <tr>
         <th>Transaction Type</th>
         <th>From Account</th>
         <th>To Account</th>
         <th>Amount</th>
         <th>Transaction Date</th>
       </tr>
     </thead>
     <tbody>{transactionHistory()}</tbody>
   </table>
  </div>
);
};

