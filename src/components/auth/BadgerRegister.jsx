import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BadgerRegister() {

    // TODO Create the register component.

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Register button cilcked");
        // check that all input has been entered correctly
        if (!username || !pin) {
            alert("You must provide both a username and pin!");
            return;
        }
    
        if (!/^\d{7}$/.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }
    
        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }
        console.log("fetching data")
        // API request
        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/register", {
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
        .then(res => {
            if (res.status == 409) {
                // alert("Username already taken")
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            alert(data.msg);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    };
    

    return <>
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
            <label htmlFor="username">Username:</label>
            <input 
                id="username"
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} // update states
            />

            <label htmlFor="pin">Pin:</label>
            <input 
                id="pin"
                type="password" 
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
            />

            <label htmlFor="confirmPin">Confirm Pin:</label>
            <input 
                id="confirmPin"
                type="password" 
                value={confirmPin} 
                onChange={(e) => setConfirmPin(e.target.value)} 
            />
            <button type="submit">Register</button>
        </form>

    </>
}
