import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Fetches the session then redirects to the path based on redirectOn
// (true=redirect if session exists, false=redirect if session does not exist)
// Returns the session users username if there is one
export default function FetchSessionRedirect(redirectOn, redirectPath){
    const [sessionUser, setSessionUser] = useState({
        username: "",
    });
    
    useEffect(() => {
        async function fetchSession() {
            const response = await fetch("http://localhost:5000/getSession", {
                credentials: "include"
            })
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const data = await response.json();
            setSessionUser(data);
        }
        fetchSession();
    }, []);

    const navigate = useNavigate();
    
    if(redirectOn){
        if(sessionUser.username){
            navigate(redirectPath);
        } else {
            return sessionUser.username;
        }
    }
    else {
        if(!sessionUser.username){
            navigate(redirectPath);
        } else {
            return sessionUser.username;
        }
    }
}