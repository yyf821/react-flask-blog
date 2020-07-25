import React, { Component } from 'react';
import { Comment, Avatar, List } from 'antd';
class Comments extends Component {
    render() {
        let comments = this.props.comments
        let empty = {
            emptyText: '暂无评论，快来创建第一条评论吧'
        }
        return (
            <List
                className="comment-list"
                header={`${comments.length} 条评论`}
                itemLayout="horizontal"
                dataSource={comments}
                locale={empty}
                renderItem={c => (
                    <li>
                        <Comment
                            author={c.user}
                            avatar={
                                <Avatar
                                    src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    alt="Han Solo"
                                />
                            }
                            content={
                                <p>
                                    {c.content}
                                </p>
                            }
                            datetime={
                                <span>{c.date}</span>
                            }
                        />
                    </li>
                )}
            />
        )
    }
}

export default Comments;