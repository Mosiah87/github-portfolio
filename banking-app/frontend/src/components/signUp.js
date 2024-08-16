import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";

function FormEntry(props) {
    return (
        <form onSubmit={props.submit}>
            <div className="mb-3">
                <label for="username" className="form-label text-start">Username</label>
                <input type="text" className="form-control" id="username" value={props.input.username} onChange={(e) => props.formChange({ username: e.target.value })} />
            </div>
            <div className="mb-3">
                <label for="password" className="form-label text-start">Password</label>
                <input type={props.view} className="form-control" id="password" value={props.input.password} onChange={(e) => props.formChange({ password: e.target.value })} />
                <div className="form-text">
                    Your password must be at least 4 characters long and contain letters and numbers.
                </div>
            </div>
            <div className="mb-1">
                <label for="confirm" className="form-label text-start">Confirm Password</label>
                <input type={props.view} className="form-control" id="confirm" value={props.con} onChange={props.conChange} />
            </div>
            <div className="form-check text-start form-text mb-4">
                <input type="checkbox" className="form-check-input" id="show" onClick={props.checkbox} />
                <label for="show" className="form-check-label">Show Passwords</label>
            </div>
            
            <div className="mb-3 text-center">
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </div>
        </form>
    );
}

export default function SignUp() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [confirm, setConfirm] = useState("");
    const [view, setView] = useState("password");

    const navigate = useNavigate();

    // Unpacks and repacks the user with the new value
    function updateUser(value) {
        return setUser((prev) => {
          return { ...prev, ...value };
        });
    }

    const handleConfirmChange = event => {
        setConfirm(event.target.value);
    };

    function handleCheckbox() {
        if(view === "password") {
            setView("text");
        }
        else {
            setView("password");
        }
    }

    async function onSubmit(e) {
        e.preventDefault();

        if(!user.username || !user.password || !confirm) {
            window.alert("Please enter a valid username and password");
        }
        else if (!(user.password === confirm)) {
            window.alert("Your password confirmation must match your password");
            setConfirm("");
        }
        else {
            const response = await fetch(`http://localhost:5000/${user.username}`);
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const checkedUser = await response.json();

            // Check password requirements
            if (!(/[a-zA-Z]/.test(user.password) && /[0-9]/.test(user.password) && user.password.length >= 4)) {
                window.alert("Your password does not meet the necessary requirements")
            }
            else if (checkedUser) {
                window.alert("The username " + user.username + " is already taken. Please enter a different one.")
            }
            else {
                const newUser = { ...user };

                // Add user
                await fetch("http://localhost:5000/users/add", {
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

                // Set session for new user and log them in
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

                setUser({ username: "", password: "" });
                setConfirm("");

                navigate("/home");
            }
        }
    };


    return (
        <div className="container">
            <h1 className="mb-4 text-center">Sign Up For An Account</h1>
            <div className="row">
                <div className="col"></div>
                <div className="col"> 
                    <FormEntry
                        submit={onSubmit} 
                        input={user} 
                        formChange={updateUser}
                        con={confirm}
                        conChange={handleConfirmChange}
                        view={view}
                        checkbox={handleCheckbox}
                    />
                </div>
                <div className="col"></div>
            </div>
        </div>
    )
}
