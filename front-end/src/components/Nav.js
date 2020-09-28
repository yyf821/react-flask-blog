import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'antd';
import UserInfo from './UserInfo'

function Nav() {
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
                        <Menu.Item key={index}><Link to={e.url}>{e.text}</Link></Menu.Item>
                    )
                }
            </Menu>
            <UserInfo />
        </nav>
    )
}

export default Nav
