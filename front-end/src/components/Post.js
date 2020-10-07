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

        this.fetchData = this.fetchData.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    componentDidMount() {
        this.fetchData(1)
    }

    fetchData(e) {
        let posts = this.api.all(e)
        posts.then(result => {
            this.setState({
                isLoaded: true,
                posts: result.posts,
                count: result.totalPosts,
            })
        })
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
                    <Pagination style={{ textAlign: "center" }} defaultPageSize={5} defaultCurrent={1} total={count} onChange={this.fetchData} />
                </div>
            </HomeLayout>
        );
    }
}

export default Post;