import React from 'react';
import { HashRouter as Router, Route, Link } from "react-router-dom";

import { SocialIcon } from 'react-social-icons'

import Home from './pages/home'
import Resume from './pages/resume'
import Projects from './pages/projects'

import Logo from './logo/jw-logo.svg.js';
import './App.css';


const socialConfig = {
  style: { height: 25, width: 25 },
  fgColor: 'white',
  bgColor: 'rgb(70, 70, 70)'
}

function App () {
  return (
    <Router>
      <div className="App">
        <div className="logo">
          <Link to="/">
            <Logo/>
          </Link>
        </div>
        <div className="nav">
          <div className="links">
            <Link to="/">HOME</Link>
            {/* <Link to="/blog/">BLOG</Link> */}
            <Link to="/projects/">PROJECTS</Link>
            <Link to="/resume/">RESUME</Link>
          </div>
          <div className="socials">
            <SocialIcon url="http://github.com/jaywunder" {...socialConfig}/>
            <SocialIcon url="https://www.linkedin.com/in/jacob-wunder-905498128/" {...socialConfig} />
            <SocialIcon url="https://twitter.com/wowjacobwunder" {...socialConfig} />
          </div>
        </div>
        <div className="content">
          <Route path="/" exact component={Home} />
          <Route path="/blog/" exact component={Home} />
          <Route path="/projects/" exact component={Projects} />
          <Route path="/resume/" exact component={Resume} />
        </div>
      </div>
      <canvas id="koi-canvas" />
    </Router>
  )
}

export default App;
