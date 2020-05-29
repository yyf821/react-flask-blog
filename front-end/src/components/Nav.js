import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd';
import UserInfo from './UserInfo'

// import classNames from 'classnames'

class Nav extends Component {
    // 根据动态路由的 path 渲染「当前」菜单
    // classNames 是 react 项目中常用的一个 css class 库
    // classForPath = (menu) => {
    //     let path = this.props.path
    //     let c = classNames({
    //         'active': menu.url === path,
    //     })
    //     return c
    // }
    render() {
        let menus = [
            {
                text: 'home',
                url: '/',
            },
            {
                text: 'login',
                url: '/login',
            },
        ]
        return (
            <nav className="top-menu">
                <Menu theme="dark" mode="horizontal">
                    {
                        menus.map((e, index) =>
                            // Link 组件相当于 a 标签的作用, to 相当于 href 属性
                            <Menu.Item key={index}><Link to={e.url}>{e.text}</Link></Menu.Item>
                        )
                    }
                </Menu>
                <UserInfo/>
            </nav>
        )
    }
}

export default Nav
