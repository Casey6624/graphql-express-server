/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useContext, Fragment } from "react"
import AuthContext from "../../context/auth-context"
import { NavLink } from "react-router-dom"
import "./MainNavigation.css"

export default function MainNavigation(props){
    const contextAuth = useContext(AuthContext)
    return(
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>EasyEvent <span role="img"> 🤘🏼 </span> </h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {/*We use NavLink instead of Link because you get an extra CSS class for Active state */}
                    <li>   
                        <NavLink to="/events"> EVENTS </NavLink>
                    </li>
                    { contextAuth.token && <Fragment>
                        <li>   
                        <NavLink to="/bookings"> BOOKINGS </NavLink>
                    </li> 
                    <li>
                        <button onClick={contextAuth.logout}>LOGOUT</button>
                    </li>
                    </Fragment>
                    }
                    { !contextAuth.token && <li>   
                        <NavLink to="/auth"> LOGIN </NavLink>
                    </li> }
                </ul>
            </nav>
        </header>
    )
}