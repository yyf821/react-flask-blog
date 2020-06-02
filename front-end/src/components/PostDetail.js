import React, { Component } from 'react';
import Comments from './Comments'
import HomeLayout from '../layouts/HomeLayout';
import PostApi from '../api/post'
import { dateFormat } from "../utils"

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.api = new PostApi()
        this.state = {
            // 获取动态路由中参数的值
            isLoaded: false,
            id: this.props.match.params.id,
            post: {},
        };
    }

    componentDidMount() {
        const id = this.state.id
        this.api.detail(id).then(result => {
            this.setState({
                isLoaded: true,
                post: result,
            });
        })

    }
    render() {
        const { isLoaded, post } = this.state;
        const { title, body, author, current, date } = post
        let content, edit;
        if (current) {
            edit = <div>编辑 | 删除</div>
        }
        if (!isLoaded) {
            content = <div>Loading...</div>;
        } else {
            content = <div>
                <h1>{title}</h1>
                <p>{author} {dateFormat(date)}</p>
                {edit}
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