import React, { Component } from 'react';
import { Button } from 'antd';
import PostApi from '../api/post'
class Edit extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.handleClick = this.handleClick.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeBody = this.changeBody.bind(this);
        this.addPost = this.addPost.bind(this);
        this.state = {
            editing: false,
            title: '',
            body: '',
        };
    }

    handleClick() {
        this.setState({ editing: !this.state.editing });
    }

    changeTitle(e) {
        this.setState({ title: e.target.value });
    }

    changeBody(e) {
        this.setState({ body: e.target.value });
    }
    addPost() {
        let data = {
            title: this.state.title,
            content: this.state.body
        }
        let posts = this.api.add(data)
        posts.then(result => {
            this.props.onChange(1)
        })
    }
    render() {
        const form = (
            <div>
                标题：<input onChange={this.changeTitle} /><br />
                内容：<textarea onChange={this.changeBody} /><br />
                <button onClick={this.addPost}>submit</button>
            </div>
        )
        return (
            <div>
                <Button type="primary" onClick={this.handleClick} >
                    发表博客
                </Button>
                {this.state.editing && form}
            </div>

        );
    }
}
export default Edit;