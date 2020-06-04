import React, { Component } from 'react';
import Post from "./components/Post";
import NoMatch from "./components/NoMatch";
import Login from "./components/Login";
import PostDetail from "./components/PostDetail";
import UserProfile from "./components/UserProfile";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
class App extends Component {
    render() {
        return (
            // BrowserRouter 会使用 HTML5 的 history API 渲染单页路由
            <Router>
                <Switch>
                    <Route exact path="/" component={Post} />
                    <Route exact path="/login" component={Login} />
                    <Route path="/posts/:id" component={PostDetail} />
                    <Route path="/user/:id" component={UserProfile} />
                    <Route component={NoMatch} />
                </Switch>
            </Router>
        )
    }
}

export default App
