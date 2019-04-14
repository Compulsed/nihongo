import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout } from 'antd';

import './App.css';

import { WordInput } from './pages/word-input';
import { Home } from './pages/home';
import { Topics } from './pages/topics';

function BasicExample() {
  return (
    <Router>
      <Layout>
        <Layout.Header>header</Layout.Header>
        <Layout>
          <Layout.Sider>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/word-input">Word Input</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>
          </div>
          </Layout.Sider>
          <Layout.Content>
              <Route exact path="/" component={Home} />
              <Route path="/word-input" component={WordInput} />
              <Route path="/topics" component={Topics} />
          </Layout.Content>
        </Layout>
        <Layout.Footer>footer</Layout.Footer>
      </Layout>
    </Router>
  );
}



export default BasicExample;
