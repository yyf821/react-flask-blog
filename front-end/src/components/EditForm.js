import { Form, Input, Button } from 'antd';
import React from 'react';

const EditForm = (props) => {
    const onFinish = values => {
        props.handleSubmit(values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
                title: props.title,
                content: props.content
            }}
        >
            <Form.Item
                label="标题"
                name="title"
                rules={[
                    {
                        required: true,
                        message: '标题不能为空',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="内容"
                name="content"
                rules={[
                    {
                        required: true,
                        message: '内容不能为空',
                    },
                ]}
            >
                <Input.TextArea
                    autoSize={{ minRows: 10 }} />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};
export default EditForm;