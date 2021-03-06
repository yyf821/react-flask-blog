import React, { Component } from 'react';
import Error from './Error'
import HomeLayout from '../layouts/HomeLayout';
import UserApi from '../api/user'
import Avatar from './Avatar'
import styles from './UserProfile.module.css';

class PostDetail extends Component {
    constructor(props) {
        super(props);
        this.api = new UserApi()
        this.state = {
            // 获取动态路由中参数的值
            isLoaded: false,
            id: this.props.match.params.id,
            user: {},
            error: null,
        };
    }

    componentDidMount() {
        const id = this.state.id
        this.api.detail(id).then(result => {
            this.setState({
                isLoaded: true,
                user: result,
            });
        }, error => {
            this.setState({
                isLoaded: true,
                error: error
            });
        })

    }


    render() {
        const { isLoaded, user, error } = this.state;
        const { username, email, avatar_url } = user
        let content;

        if (error) {
            content = <Error error={error} />;
        } else if (!isLoaded) {
            content = <div>Loading...</div>;
        } else {
            content = <div>
                <div className={styles.box}>
                    <img src={`http://localhost:5000${avatar_url}`} alt="avatar" className={styles.cover} />
                </div>
                <h1>{username}</h1>
                <p>{email}</p>
            </div>
        }
        return (
            <HomeLayout title="博客详情">
                <div className="site-layout-content">
                    {content}
                    {this.props.user}
                    <Avatar />
                </div>
            </HomeLayout>

        );
    }
}

export default PostDetail;