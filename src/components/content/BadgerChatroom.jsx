import React, { useEffect, useState, useContext, useRef } from "react"
import BadgerMessage from "./BadgerMessage"
import { Container, Row, Col, Pagination } from "react-bootstrap";
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);

    const [loginStatus] = useContext(BadgerLoginStatusContext);

    const titleRef = useRef();
    const contentRef = useRef();

    const deletePost = (messageId) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${messageId}`, {
            method: "DELETE",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        })
        .then(res => res.json())
        .then(() => {
            alert("Successfully deleted the post!");
            loadMessages(); // Reload messages after deletion
        })
        .catch(error => {
            console.error("Error deleting post:", error);
        });
    };
    

    const handlePost = (e) => {
        e.preventDefault();
    
        const title = titleRef.current.value.trim();
        const content = contentRef.current.value.trim();
    
        if (!title || !content) {
            alert("You must provide both a title and content!");
            return;
        }
    
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            body: JSON.stringify({
                title: title,
                content: content
            }),
            credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
            alert("Successfully posted!");
            loadMessages(); // Reload messages after posting
        })
        .catch(error => {
            console.error("Error:", error);
        });
    };

    const loadMessages = () => {
        console.log("Loading messages...");
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(json => {
            setMessages(json.messages);
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.

    useEffect(loadMessages, [props, page]); // reload messages when page changes

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            !loginStatus ? (
                <p>You must be logged in to post!</p>
            ) : (
                <form onSubmit={handlePost}>
                    <label htmlFor="postTitle">Title:</label>
                    <input id="postTitle" type="text" ref={titleRef} />

                    <label htmlFor="postContent">Content:</label>
                    <textarea id="postContent" ref={contentRef}></textarea>


                    <button type="submit">Create Post</button>
                </form>
            )
        }

        <hr/>
        {
            messages.length > 0 ?
                <>
                    {
                        <Row>
                            {messages.map(message => (
                                <Col xs={12} sm={6} md={4} lg={3} key={message.id}>
                                    <BadgerMessage 
                                        id={message.id}
                                        title={message.title} 
                                        poster={message.poster} 
                                        content={message.content} 
                                        created={message.created} 

                                        currentUser={loginStatus}
                                        onDelete={deletePost}
                                    />
                                </Col>
                            ))}
                        </Row>
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>   
        }
        <Pagination className="justify-content-center">
            {[1, 2, 3, 4].map(num => (
                <Pagination.Item 
                    key={num} 
                    active={num === page} 
                    onClick={() => setPage(num)}
                >
                    {num}
                </Pagination.Item>
            ))}
        </Pagination>

    </>
}
