import './App.css';
import Header from './components/header/header.component';
import PageNotFound from './pages/404Page/404Page.component';
import UserProfile from './pages/user-profile/user-profile.component';
import UserProject from './pages/user-project/user-project.component';
import Notification from './pages/notification/notification.component';
import SearchPage from './pages/search-page/search-page.component';
import MainPage from './pages/main-page/main-page.component';
import React, { useState } from 'react';

import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';


class App extends React.Component {

  constructor() {
    super();

    this.state = {
      isLogin: true,
    }
  }

  handleLogin() {
    let scope = "user"
    window.open(`https://github.com/login/oauth/authorize?client_id=b12992310cea8b04dcab&scope=${scope}`)
  }

  renderPage() {
    if (this.state.isLogin) {
      return (
        <Router>
          <Header handleLogin={this.handleLogin.bind(this)} />
          <br /><br />
          <Switch>
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/profile" component={UserProfile} />
            <Route exact path="/projects" component={UserProject} />
            <Route exact path="/notifications" component={Notification} />
            <Route component={PageNotFound} />
          </Switch>
        </Router>
      )
    }
    else {
      return (
        <Router>
          <Switch>
            <Route exact path="/">
              <MainPage data={{
                isLogin: this.state.isLogin,
                handleLogin: this.handleLogin.bind(this)
              }} />
            </Route>
          </Switch>
        </Router>
      )
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderPage()}
      </div>
    )
  }
}

export default App;
