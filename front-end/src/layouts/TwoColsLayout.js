import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { Row, Col } from 'antd';

const TwoColsLayout = (props) => {
    return (
        <HomeLayout title={props.title}>
            <div className='two-cols-layout'>
                <Row gutter={16}>
                    <Col span={16}>{props.children[0]}</Col>
                    <Col span={8}>{props.children[1]}</Col>
                </Row>
            </div>
        </HomeLayout>
    );
};

export default TwoColsLayout