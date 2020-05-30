import React, { Component } from 'react';
import { Layout } from 'antd';
import Nav from '../components/Nav';
const { Header, Footer, Content } = Layout;
class HomeLayout extends Component {
    componentDidMount() {
        document.title = this.props.title
    }

    render() {
        const { children } = this.props;
        return (
            <Layout>
                <Header>
                    <Nav/>
                </Header>
                <Content>
                    {children}
                </Content>
                <Footer className="center">Footer</Footer>
            </Layout>
        );
    }
}

export default HomeLayout;