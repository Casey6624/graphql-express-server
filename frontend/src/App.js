import React, { Fragment, useContext } from 'react';
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

  function login(){

  }

  function logout(){
    
  }

    return (
      <BrowserRouter>
        <Fragment>
          <AuthContext.Provider value={{
            token: null,
            login: login,
            logout: logout,
            userId: null
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

