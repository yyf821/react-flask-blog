import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { List } from 'antd';
class PostList extends Component {
    render() {
        let posts = this.props.posts
        // const content = posts.map((post) => {
        //     return (
        //         <li key={post.id}>
        //             <div>
        //                 <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
        //                 <p>{post.body}</p>
        //             </div>
        //         </li>
        //     )
        // });
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
                            <span>{post.date}</span>
                        </div>
                    </List.Item>
                )}
            />
        )
    }
}

export default PostList