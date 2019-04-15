import React, { Component } from 'react';
import {Route, BrowserRouter, Redirect, Switch} from "react-router-dom"
// Pages
import AuthPage from "./pages/Auth"
import BookingsPage from "./pages/Bookings"
import EventsPage from "./pages/Events"

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect 
          from="/"
          to="/auth"
          exact
          />
          <Route 
          path="/auth"
          component={AuthPage}
          />
          <Route 
          path="/events"
          component={EventsPage}
          />
          <Route 
          path="/bookings"
          component={BookingsPage}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
