import React, { Component } from 'react';
import Comments from './Comments'
import Error from './Error'
import TwoColsLayout from '../layouts/TwoColsLayout';
import PostApi from '../api/post'
import CommentApi from '../api/comment'
import { dateFormat } from "../utils"
import { Comment, Avatar, Button, Space, Form, Input } from 'antd';
import EditForm from "./EditForm";

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                添加评论
            </Button>
        </Form.Item>
    </>
);

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.commentApi = new CommentApi()
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
            comments: [],
            submitting: false,
            value: '',
        };
    }

    componentDidMount() {
        const id = this.state.id
        this.api.detail(id).then(result => {
            this.setState({
                isLoaded: true,
                post: result,
                comments: result.comments
            });
        }, error => {
            this.setState({
                isLoaded: true,
                error: error
            });
        })

    }

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    addComments = () => {
        const { id, value } = this.state
        if (!value) {
            return;
        }
        this.setState({
            submitting: true,
        });
        this.commentApi.add({ post_id: id, content: value }).then(result => {
            if (!result.data) {
                alert(result.msg)
                this.setState({
                    submitting: false,
                });
                return
            }
            let { user, date, content } = result.data
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        user,
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content,
                        date,
                    },
                    ...this.state.comments,
                ]
            })

        })
    }


    handleClick() {
        this.setState({ editing: !this.state.editing })
    }

    deletePost() {
        const id = this.state.id
        this.api.delete(id).then(result => {
            this.props.history.push("/")
        })
    }

    updatePost(data) {
        const id = this.state.id
        let post = this.state.post
        this.api.update(id, data).then(result => {
            post.title = result.title
            post.body = result.content
            this.setState({
                post: post,
                editing: false
            });
        })

    }

    render() {
        const { isLoaded, post, error, value, submitting } = this.state;
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
                <Comments comments={this.state.comments} />
                <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                            alt="Han Solo"
                        />
                    }
                    content={
                        <Editor
                            onChange={this.handleChange}
                            onSubmit={this.addComments}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
            </div>
        }
        return (
            <TwoColsLayout title="博客详情">
                <div className="white main">
                    {content}
                </div>
                <div className="white side">
                    <h1>{this.state.post.author}</h1>
                </div>
            </TwoColsLayout>

        );
    }
}

export default PostDetail;