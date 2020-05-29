import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import UserApi from '../api/user'
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.api = new UserApi()
        this.state = {
            user: {},
            isLogin: false,
        };
    }
    componentDidMount() {
        let user = this.api.getInfo()
        user.then(result => {
            if (result.data) {
                this.setState({
                    user: result.data,
                    isLogin: true,
                })
            }
        })
    }
    render() {
        let info = null
        if (this.state.isLogin) {
            let { id, username } = this.state.user
            info = (
                <div><Link to={`/user/${id}`}>{username}</Link></div>
            )
        } else {
            info = (
                <div><Link to={`/login`}>login</Link></div>
            )
        }

        return (
            <div>{info}</div>
        );
    }
}

export default UserInfo;