import React from 'react';
import { useRef, useContext} from "react";
import { useNavigate } from "react-router-dom";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";


export default function BadgerLogin() {

    // TODO Create the login component.

    const usernameRef = useRef();
    const pinRef = useRef();

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    const handleLogin = e => {
        e.preventDefault();

        const username = usernameRef.current.value.trim();
        const pin = pinRef.current.value.trim();
        // validate the input
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }
        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin is a 7-digit number!");
            return;
        }
        // API call after input is valid
        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({
                username: username,
                pin: pin
            }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.msg);
            console.log(data.msg);
            if (data.msg === "Successfully authenticated.") {
                console.log("state set)")
                setLoginStatus(username);
                sessionStorage.setItem("loginStatus", data.user.username);
                navigate("/");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    }

    return <>
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
                id="username"
                ref={usernameRef}
                type="text"
                autoComplete="off"
            />

            <label htmlFor="pin">Pin</label>
            <input
                id="pin"
                ref={pinRef}
                type="password"
            />

            <button type="submit">Login</button>
        </form>


    </>
}
