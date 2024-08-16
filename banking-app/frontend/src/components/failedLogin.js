import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import FetchSessionRedirect from "./fetchSession";

function FailInfo(props) {
    if(props.session) {
        return(<></>)
    }
    else {
        return(
            <div className="container text-center">
                <h1 className="mb-3">You are not logged in</h1>
                <div className="row">
                    <div className="col"></div>
                    <div className="col"> 
                        <Link to={'/'}>Try logging in here</Link>
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        )
    }
}

export default function FailedLogin() {
    const [sessionUser] = useState(FetchSessionRedirect(true, '/home'));

    return (
        <FailInfo session={sessionUser} />
    )
}