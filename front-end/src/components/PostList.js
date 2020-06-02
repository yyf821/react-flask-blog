import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { List } from 'antd'
import { dateFormat } from "../utils"


class PostList extends Component {
    render() {
        let posts = this.props.posts
        return (
            <List
                header={<h1>文章列表</h1>}
                itemLayout="vertical"
                dataSource={posts}
                renderItem={post => (
                    <List.Item>
                        <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
                        <div className='list-icon'>
                            <span>{post.author} </span>
                            <span>{dateFormat(post.date)}</span>
                        </div>
                    </List.Item>
                )}
            />
        )
    }
}

export default PostList