import React, { Component } from 'react';
import PostList from "./PostList";
import EditForm from "./EditForm";
import HomeLayout from '../layouts/HomeLayout';
import { Pagination, Button } from 'antd';
import PostApi from '../api/post'

class Post extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.state = {
            editing: false,
            isLoaded: false,
            posts: [],
            error: null,
            count: 0,
        };

        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    componentDidMount() {
        let posts = this.api.all()
        posts.then(result => {
            // 获取数据后在回调函数中更新 todos 的值
            this.setState({
                isLoaded: true,
                posts: result.posts,
                count: result.totalPosts,
            })
        })
    }

    onChange(e) {
        const url = 'http://localhost:5000/api/article?page=' + e
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        posts: result.posts,
                        count: result.totalPosts,
                    });
                },
                // 注意：需要在此处处理错误
                // 而不是使用 catch() 去捕获错误
                // 因为使用 catch 去捕获异常会掩盖掉组件本身可能产生的 bug
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    handleClick() {
        this.setState({ editing: !this.state.editing });
    }

    addPost(data) {
        let posts = this.api.add(data)
        posts.then(result => {
            this.onChange(1)
        })
    }

    render() {
        let { posts, count } = this.state

        return (
            <HomeLayout title="欢迎来到博客">
                <div className="site-layout-content">
                    <Button type="primary" onClick={this.handleClick} className="div-space">
                        发表博客
                    </Button>
                    {this.state.editing && <EditForm handleSubmit={this.addPost} />}
                    <PostList posts={posts} />
                    <Pagination style={{ textAlign: "center" }} defaultPageSize={5} defaultCurrent={1} total={count} onChange={this.onChange} />
                </div>
            </HomeLayout>
        );
    }
}

export default Post;