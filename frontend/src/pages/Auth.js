import React, { useState, useContext } from "react";
import "./Auth.css"
import AuthContext from "../context/auth-context";

export default function Auth(props){

    const GraphQL = "http://localhost:4000/graphiql"

    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [isLogin, setIsLogin] = useState(true)

    const contextAuth = useContext(AuthContext)

    function submitHandler(e){
        e.preventDefault()
        if(emailAddress.trim().length === 0 || password.trim().length === 0){
            return
        }
        let requestBody = {
            query: `
            query{
                login(email: "${emailAddress}", password: "${password}"){
                  userId
                  token
                  tokenExpiration
                }
              }
            `
        }
        if(!isLogin){
            requestBody = {
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
        }

        fetch(GraphQL, {
            // All GraphQL queries require POST as they need a message body
            method: "POST",
            body: JSON.stringify(requestBody),
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            // 200 == success, 201 == created 
            if(res.status !== 200 && res.status !== 201){
                throw new Error("Failed!")
            }
            return res.json()
        })
        .then(resData => {
            if(resData.data.login.token){
                // Here we destructure data and pass the three params to the login method within context
                let { token, userId, tokenExpiration } = resData.data.login
                contextAuth.login(token, userId, tokenExpiration)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    return(
        <div>
            <h1 style={{textAlign: "center"}}>
            {isLogin ? "Log In" : "Sign Up"} | EasyEvent
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
                    <button 
                    type="button"
                    onClick={e => setIsLogin(!isLogin)}
                    >Switch To {isLogin ? "Sign Up" : "Log In"}</button>
                </div>
            </form>
        </div>
    )
} 