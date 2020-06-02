import React, { Component } from 'react';
import Comments from './Comments'
import Error from './Error'
import HomeLayout from '../layouts/HomeLayout';
import PostApi from '../api/post'
import { dateFormat } from "../utils"
import { Button } from 'antd';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.deletePost = this.deletePost.bind(this);
        this.state = {
            // 获取动态路由中参数的值
            isLoaded: false,
            id: this.props.match.params.id,
            post: {},
            error: null,
        };
    }

    componentDidMount() {
        const id = this.state.id
        this.api.detail(id).then(result => {
            this.setState({
                isLoaded: true,
                post: result,
            });
        }, error => {
            this.setState({
                isLoaded: true,
                error: error
            });
        })

    }

    deletePost() {
        const id = this.state.id
        this.api.delete(id).then(result => {
            this.props.history.push("/")
        })
    }

    render() {
        const { isLoaded, post, error } = this.state;
        const { title, body, author, current, date } = post
        let content, edit;

        if (error) {
            content = <Error error={error}/>;
        } else if (!isLoaded) {
            content = <div>Loading...</div>;
        } else {
            if (current) {
                edit = <span>
                    <Button size="small">编辑</Button>
                    <Button size="small" onClick={this.deletePost}>删除</Button>
                </span>
            }
            content = <div>
                <h1>{title}{edit}</h1>
                <p>{author} {dateFormat(date)}</p>
                <p>{body}</p>

                <h2>Comments</h2>
                <Comments comments={post.comments} />
            </div>
        }
        return (
            <HomeLayout title="博客详情">
                <div className="site-layout-content">
                    {content}
                    {this.props.user}
                </div>
            </HomeLayout>

        );
    }
}

export default PostDetail;