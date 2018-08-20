import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  NavLink,
  Redirect
} from 'react-router-dom';

import './App.css';

import Main from './components/Main';
import About from './components/About';
import Results from './components/Results';
import Submit from './components/Submit';

const domain = 'http://localhost:8080';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <header>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                  src="/icon.png"
                  width={30}
                  className="mr-2"
                  alt="Main Logo"
                />
                Smallpox Reunion Photos
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse justify-content-end"
                id="navbarNav"
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/"
                      exact
                      activeClassName="active"
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/about"
                      activeClassName="active"
                    >
                      About
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link mr-2"
                      to="/results"
                      activeClassName="active"
                    >
                      Submissions
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      className="btn btn-outline-success"
                      to="/submit"
                      activeClassName="active"
                    >
                      Submit
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <div>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/about" component={About} />
              <Route
                path="/submit"
                component={() => <Submit domain={domain} />}
              />
              <Route
                path="/results"
                component={() => <Results domain={domain} />}
              />
              <Route component={() => <Redirect to="/" />} />
            </Switch>
          </div>
          <footer className="text-muted">
            <div className="container">
              <div className="row">
                <p className="col-sm">
                  Copyright &copy; 2018 Michael Foster / Bootstrap
                </p>
                <div className="col-sm">
                  <p className="float-right">
                    <a href="mailto:smallpox@hingobway.me">
                      smallpox@hingobway.me
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
