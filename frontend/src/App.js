import React, { Fragment, useState } from 'react';
import {Route, BrowserRouter, Redirect, Switch} from "react-router-dom"
// Pages
import AuthPage from "./pages/Auth"
import BookingsPage from "./pages/Bookings"
import EventsPage from "./pages/Events"
// components
import MainNavigation from "./components/Navigation/MainNavigation"
// Styling
import "./App.css"

import AuthContext from "./context/auth-context"

export default function App(props) {

  const [ token, setToken ] = useState(null)
  const [ userId, setUserId ] = useState(null)

  function login( token, userId, tokenExpiration ){
    setToken(token)
    setUserId(userId)
  }

  function logout(){
    setToken(null)
    setUserId(null)
  }

    return (
      <BrowserRouter>
        <Fragment>
          <AuthContext.Provider value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout
          }}>
            <MainNavigation />
              <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth"component={AuthPage} />
                <Route path="/events"component={EventsPage}/>
                <Route path="/bookings"component={BookingsPage}/>
              </Switch>
              </main>
          </AuthContext.Provider>
        </Fragment>
      </BrowserRouter>
    );
  }

