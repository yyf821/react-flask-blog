import React, { Component } from 'react';
import { Button } from 'antd';
import Api from '../api/api'


class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            imageURL: '',
        };
        this.api = new Api()
    }
    handleChange = event => {
        console.log(event.target.files[0]);
        this.setState({
            file: event.target.files[0]
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let file = this.state.file
        if (!file) {
            return
        }
        let fd = new FormData()
        fd.append('avatar', file)
        this.api.upload('/upload', fd).then(result => {
            this.setState({
                imageURL: `http://localhost:5000${result.result}`
            });
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="file" onChange={this.handleChange} />
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                {this.state.imageURL &&
                    <img src={this.state.imageURL} alt="img" />
                }
            </form>
        );
    }
}

export default Avatar;