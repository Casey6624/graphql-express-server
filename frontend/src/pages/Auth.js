import React, { useState } from "react";
import "./Auth.css"

export default function Auth(props){

    const GraphQL = "http://localhost:4000/graphiql"

    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")

    function submitHandler(e){
        e.preventDefault()
        if(emailAddress.trim().length === 0 || password.trim().length === 0){
            return
        }

        const requestBody = {
            query: `
            mutation{
                createUser(userInput : {
                  email: "${emailAddress}",
                  password: "${password}"
                }){
                  email
                }
              }
            `
        }

        fetch(GraphQL, {
            // All GraphQL queries require POST as they need a message body
            method: "POST",
            body: JSON.stringify(requestBody),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }

    return(
        <div>
            <h1 style={{textAlign: "center"}}>
                Sign In | EasyEvent
            </h1>
            <form className="auth-form" onSubmit={submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" onChange={e => setEmailAddress(e.target.value)}/>
                </div>
                <div className="form-control">
                    <label htmlFor="email">Password</label>
                    <input type="password" id="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="form-actions">
                <button type="submit">Submit</button>
                    <br />
                    <button type="button">Switch To Signup</button>
                </div>
            </form>
        </div>
    )
} 