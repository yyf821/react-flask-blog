import React from 'react';
import Error from './Error'
import HomeLayout from '../layouts/HomeLayout';

const NoMatch = () => {
    const error = {
        code: 404,
        name: '找不到页面',
        description: '对不起你要访问的页面不存在'
    }

    return (
        <HomeLayout title="找不到页面">
            <div className="site-layout-content">
                <Error error={error} />
            </div>
        </HomeLayout>
    );
};

export default NoMatch