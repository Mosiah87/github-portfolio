import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function Login() {

    const [user, setUser] = useState({
        username: "",
        password: "",
    })

    const navigate = useNavigate();

    function updateUser(value) {
        return setUser((prev) => {
          return { ...prev, ...value };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (!user.username || !user.password) {
            window.alert("Please enter a valid username and password");
        }
        else {
            let newUser = { ...user };

            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                    body: JSON.stringify(newUser),
                })
                .catch(error => {
                    window.alert(error);
                    return;
            });
            const userAuth = await response.json();

            if (!userAuth.auth) {
                window.alert("Invalid username or password");
            }
            else {
                newUser.loggedIn = true;

                await fetch("http://localhost:5000/setSession", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                        body: JSON.stringify(newUser),
                })
                .catch(error => {
                    window.alert(error);
                    return;
                });

                navigate("/home")
            }
        }
    };

    return (
        <div className="container text-center">
            <h1 className="mb-4">Login</h1>
            <div className="row">
                <div className="col"></div>
                <div className="col"> 
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Username" value={user.username} onChange={(e) => updateUser({ username: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Password" value={user.password} onChange={(e) => updateUser({ password: e.target.value})} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Log In</button>
                        </div>
                    </form>
                    <p>Don't have an account? <Link to={`/signup`}>Sign up here</Link></p>
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}