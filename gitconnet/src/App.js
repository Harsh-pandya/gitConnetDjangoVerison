import './App.css';
import Header from './components/header/header.component';
import PageNotFound from './pages/404Page/404Page.component';
import UserProfile from './pages/user-profile/user-profile.component';
import UserProject from './pages/user-project/user-project.component';
import Notification from './pages/notification/notification.component';
import SearchPage from './pages/search-page/search-page.component';
import MainPage from './pages/main-page/main-page.component';
import React, { useState } from 'react';
import { BASE_URL } from './constant'
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import axios from 'axios';


function PrivateRoute({ exact, path, component: Component }) {
  const [login, setLogin] = React.useState(false)
  const validate = async () => {
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/page-validation`,
      withCredentials: true
    })
    if (response.data.status === "OK") {
      setLogin(true)
    }
    else if (response.data.status === "ERROR") {
      setLogin(false)
    }
    return login
  }
  return (
    validate() ? (
      <>
        <Route exact path={path} component={Component} />
      </>
    ) : (
        <>
          <Redirect to="/" />
        </>
      )
  )

}
class App extends React.Component {



  renderPage() {
    return (
      <Router>
        <Header />
        <br /><br />
        <Switch>
          <Route exact path="/" component={MainPage} />
          <PrivateRoute exact path="/search" component={SearchPage} />
          <PrivateRoute exact path="/profile" component={UserProfile} />
          <PrivateRoute exact path="/projects" component={UserProject} />
          <PrivateRoute exact path="/notifications" component={Notification} />
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    )
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
