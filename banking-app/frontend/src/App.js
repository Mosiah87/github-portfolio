import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
// We import all the components we need in our app
import SignUp from "./components/signUp";
import Login from "./components/login";
import Home from "./components/home";
import FailedLogin from "./components/failedLogin";
import Transfer from "./components/transfer";
import TransactionHistory from "./components/transactionHistory";

 const App = () => {
 return (
   <div>
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/failedLogin" element={<FailedLogin />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transactionHistory/:type" element={<TransactionHistory />} />
            
        </Routes>
   </div>
 );
};
 export default App;