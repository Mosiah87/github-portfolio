import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.css";
import FetchSessionRedirect from "./fetchSession";

function HomeInfo (props) {
    if (!props.session) {
        return (<></>);
    }
    else {
        return (
            <div className="container">
                <nav className="navbar">
                    <div className="container-fluid">
                        Welcome, {props.user.username}
                        <form onSubmit={props.logOut}>
                            <div>
                                <button type="submit" className="btn btn-outline-danger">Log Out</button>
                            </div>
                        </form>
                    </div>
                </nav>
                <div className="row">
                    <div className="col"></div>
                    <div className="col-5 text-center">
                        <h1>Banking Home</h1>
                        <br/>

                        <div className="d-grid gap-2">
                            <Link className="btn btn-light" to={"/transactionHistory/Savings"}><p>Savings Account</p>Balance: ${props.balances.savings}</Link>
                        </div>
                        <br/>
                        
                        <div className="d-grid gap-2">
                            <Link className="btn btn-light" to={"/transactionHistory/Checking"}><p>Checking Account</p>Balance: ${props.balances.checking}</Link>
                        </div>
                        <br/>

                        <div className="d-grid gap-2">
                            <Link className="btn btn-light" to={"/transactionHistory/Credit"}><p>Credit Account</p>Balance: ${props.balances.credit}</Link>
                        </div>
                        <br/>

                        <div className="d-flex justify-content-between">
                            <Link className="btn btn-outline-primary" to={"/transactionHistory/all"}>Transaction History</Link>
                            <Link className="btn btn-outline-primary" to={"/transfer"}>Transfer</Link>
                        </div>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        );
    }
}

export default function Home() {
    const [user, setUser] = useState({
        username: ""
    });
    const [balances, setBalances] = useState({
        checking: null,
        savings: null,
        credit: null
    });
    const sessionUser = FetchSessionRedirect(false, '/failedLogin');

    function updateBalances(value) {
        return setBalances((prev) => {
          return { ...prev, ...value };
        });
    }

    useEffect(() => {
        async function fetchUser() {
            if(sessionUser){
                const response = await fetch(`http://localhost:5000/${sessionUser}`);
                if (!response.ok) {
                    const message = `An error has occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }
                const checkedUser = await response.json();
                setUser(checkedUser);

                // Get and set account balances
                const resAccounts = await fetch("http://localhost:5000/getAccounts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                        body: JSON.stringify(checkedUser),
                }).catch(error => {
                    window.alert(error);
                    return;
                });
                const accounts = await resAccounts.json();

                const ch = accounts.filter(obj => obj.type === "Checking");
                const sv = accounts.filter(obj => obj.type === "Savings");
                const cr = accounts.filter(obj => obj.type === "Credit");

                const myobj ={
                    checking: Number(ch[0].balance.$numberDecimal).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    savings: Number(sv[0].balance.$numberDecimal).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    credit: Number(cr[0].balance.$numberDecimal).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                };

                updateBalances(myobj);
            }
        }
        fetchUser();
    }, [sessionUser]);

    const navigate = useNavigate()
    
    async function logOut(e) {
        e.preventDefault();

        await fetch("http://localhost:5000/endSession", {
            method: "POST",
            credentials: "include",
        })
        .catch(error => {
            window.alert(error);
            return;
        });
        
        navigate("/");
    }

    return (
        <HomeInfo
            session={sessionUser}
            user={user}
            logOut={logOut}
            balances={balances}
        />
    )
}