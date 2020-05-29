import React, { Component } from 'react';
import Post from "./components/Post";
import Login from "./components/Login";
import PostDetail from "./components/PostDetail";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css';
class App extends Component {
    render() {
        return (
            // BrowserRouter 会使用 HTML5 的 history API 渲染单页路由
            <Router>
                {/*Router 只能有一个子元素*/}
                <div>
                    {/*Route 组件用来匹配 location.path 的值, 并且渲染相应的组件 */}
                    {/*exact 表示路径完全匹配时才算匹配*/}
                    {/*比如 /todo/1 与 /todo 并不是完全匹配, 与 /todo/:id 完全匹配*/}
                    <Route exact path="/" component={Post} />
                    <Route exact path="/login" component={Login} />
                    <Route path="/posts/:id" component={PostDetail} />
                </div>
            </Router>
        )
    }
}

export default App
