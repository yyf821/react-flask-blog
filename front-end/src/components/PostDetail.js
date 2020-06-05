import React, { Component } from 'react';
import Comments from './Comments'
import Error from './Error'
import TwoColsLayout from '../layouts/TwoColsLayout';
import PostApi from '../api/post'
import { dateFormat } from "../utils"
import { Button, Space } from 'antd';
import EditForm from "./EditForm";

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.deletePost = this.deletePost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            // 获取动态路由中参数的值
            isLoaded: false,
            editing: false,
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

    handleClick() {
        this.setState({ editing: !this.state.editing });
    }

    deletePost() {
        const id = this.state.id
        this.api.delete(id).then(result => {
            this.props.history.push("/")
        })
    }

    updatePost(data) {
        const id = this.state.id
        this.api.update(id, data).then(result => {
            let data = Object.assign({}, this.state.post, {
                title: result.title,
                body: result.content
            })
            this.setState({
                post: data,
                editing: false
            });
        })
    }

    render() {
        const { isLoaded, post, error } = this.state;
        const { title, body, author, current, date } = post
        let content, edit;

        if (error) {
            content = <Error error={error} />;
        } else if (!isLoaded) {
            content = <div>Loading...</div>;
        } else {
            if (current) {
                edit = <>
                    <Button size="small" onClick={this.handleClick}>编辑</Button>
                    <Button size="small" onClick={this.deletePost}>删除</Button>
                </>
            }
            content = <div>
                <h1>{title}</h1>
                <Space>
                    <span>{author}</span>
                    <span>{dateFormat(date)}</span>
                    {edit}
                </Space>
                <p>{body}</p>
                {this.state.editing && <EditForm handleSubmit={this.updatePost} title={title} content={body} />}
                <h2>Comments</h2>
                <Comments comments={post.comments} />
            </div>
        }
        return (
            <TwoColsLayout title="博客详情">
                <div className="white main">
                    {content}
                </div>
                <div className="white side">22222222222222222</div>
            </TwoColsLayout>

        );
    }
}

export default PostDetail;