import React, { Component } from 'react';
import Comments from './Comments'
import HomeLayout from '../layouts/HomeLayout';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 获取动态路由中参数的值
            isLoaded: false,
            id: this.props.match.params.id,
            post: {},
            comments: [],
            error: null,
        };
    }

    componentDidMount() {
        const id = this.state.id
        fetch(`http://localhost:5000/api/article/${id}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        post: result
                    });
                },
                // 注意：需要在此处处理错误
                // 而不是使用 catch() 去捕获错误
                // 因为使用 catch 去捕获异常会掩盖掉组件本身可能产生的 bug
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        fetch(`http://localhost:5000/api/article/${id}/comments`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        comments: result.data
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
    render() {
        const { error, isLoaded, post } = this.state;
        let comments = this.state.comments
        let content;
        if (error) {
            content = <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            content = <div>Loading...</div>;
        } else {
            const { title, body, author } = post
            content = <div>
                <h1>{title}</h1>
                <p>{author}</p>
                <p>{body}</p>
                <h2>Comments</h2>
                <Comments comments={comments} />
            </div>


        }
        return (
            <HomeLayout title="Welcome">
                <div className="site-layout-content">
                    {content}
                    {this.props.user}
                </div>
            </HomeLayout>

        );
    }
}

export default PostDetail;