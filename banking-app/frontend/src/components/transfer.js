import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import FetchSessionRedirect from "./fetchSession";


export default function Transfer() {
  const navigate = useNavigate();
  const [transactionType, setTransactionType] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [fromAccountOptions, setFromAccountOptions] = useState([]);
  const [toAccountOptions, setToAccountOptions] = useState([]);

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
  

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
    // Reset account selections when transaction type changes
    setFromAccount("");
    setToAccount("");
    
   if (e.target.value === "transfer"){ 
      setFromAccountOptions(["1 - Savings", "2 - Checking", "3 - Credit"]);
      setFromAccount(e.target.value);
    } else if (e.target.value === "deposit") {
      setFromAccountOptions([]);
      setToAccountOptions(["1 - Savings", "2 - Checking", "3 - Credit"]);
      setFromAccount("0"); // Set fromAccount to "0" for deposit
    } else if (e.target.value === "withdraw") {
      setFromAccountOptions(["1 - Savings", "2 - Checking", "3 - Credit"]);
      setToAccountOptions([]);
      setToAccount("0"); // Set toAccount to "0" for withdraw
    } else {
      // Default case when no transaction type is selected
      setFromAccountOptions([]);
      setToAccountOptions([]);
    }
  };
  

  const handleFromAccountChange = (e) => {
    setFromAccount(e.target.value);
    if (transactionType === "transfer") {
      if (e.target.value === "1") {
        setToAccountOptions(["2 - Checking", "3 - Credit"]);
      } else if (e.target.value === "2") {
        setToAccountOptions(["1 - Savings", "3 - Credit"]);
      } else if (e.target.value === "3") {
        setToAccountOptions(["1 - Savings", "2 - Checking"]);
      } else {
        setToAccountOptions([]);
      }
    }
  };

  const handleToAccountChange = (e) => {
    setToAccount(e.target.value);
    if (transactionType === "transfer") {
      if (e.target.value === "1") {
        setFromAccountOptions(["2 - Checking", "3 - Credit"]);
      } else if (e.target.value === "2") {
        setFromAccountOptions(["1 - Savings", "3 - Credit"]);
      } else if (e.target.value === "3") {
        setFromAccountOptions(["1 - Savings", "2 - Checking"]);
      } else {
        setFromAccountOptions([]);
      }
    }
  };

  const handleAmountChange = (e) => {
    // Regex to allow only two decimal places for amount
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(e.target.value) || e.target.value === "") {
      setAmount(e.target.value);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    const newTransaction = {
      from: fromAccount,
      to: toAccount,
      amount: amount,
      type: transactionType,
    };

    if(!fromAccount || !toAccount || !amount || !transactionType || amount === 0) {
      window.alert("Please fill out all fields");
      return;
    };

    const response = await fetch("http://localhost:5000/transfer/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    });
    if (!response.ok) {
      const message = `An error has occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const data = await response.json();
    if (data.message) {
      window.alert(data.message);
      return;
    }

    navigate("/home");
  };

  return (
    
    <div className="container">
      <nav className="navbar">
        <div className="container-fluid">
          <Link to={"/home"} className="btn btn-outline-success">Account Home</Link>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Transaction Type:</label>
          <select
            className="form-control"
            value={transactionType}
            onChange={handleTransactionTypeChange}
          >
            <option value="">Select</option>
            <option value="transfer">Transfer between accounts</option>
            <option value="deposit">Deposit to an account</option>
            <option value="withdraw">Withdraw from an account</option>
          </select>
        </div>
  
        <div className="form-group">
          {transactionType === "transfer" || transactionType === "withdraw" ? (
            <>
              <label>From:</label>
              <select
                className="form-control"
                value={fromAccount}
                onChange={handleFromAccountChange}
              >
                <option value="">Select</option>
                {fromAccountOptions.map((option, index) => (
                  <option key={index} value={option.split(" - ")[0]}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>
  
        <div className="form-group">
          {transactionType === "transfer" || transactionType === "deposit" ? (
            <>
              <label>To:</label>
              <select
                className="form-control"
                value={toAccount}
                onChange={handleToAccountChange}
              >
                <option value="">Select</option>
                {toAccountOptions.map((option, index) => (
                  <option key={index} value={option.split(" - ")[0]}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>
  
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="text"
            className="form-control"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            required
          />
        </div>
  
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

