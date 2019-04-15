import React from "react"
import { NavLink } from "react-router-dom"
import "./MainNavigation.css"

export default function MainNavigation(props){
    return(
        <header className="main-navigation">
            <div className="main-navigation__logo">
                <h1>EasyEvent</h1>
            </div>
            <nav className="main-navigation__items">
                <ul>
                    {/*We use NavLink instead of Link because you get an extra CSS class for Active state */}
                    <li>   
                        <NavLink to="/events"> EVENTS </NavLink>
                    </li>
                    <li>   
                        <NavLink to="/bookings"> BOOKINGS </NavLink>
                    </li>
                    <li>   
                        <NavLink to="/auth"> LOGIN/LOGOUT </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}