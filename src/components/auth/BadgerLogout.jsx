import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BadgerLogout() {

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            // Maybe you need to do something here?
            
            console.log("status changed to undefined")
            sessionStorage.removeItem("loginStatus");
            setLoginStatus(undefined);
            navigate("/");
        })
    }, []);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
