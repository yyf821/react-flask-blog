import React from 'react';
function Error(props) {
    const { name, code, description } = props.error
    return (
        <div>
            <h1>{code} - {name}</h1>
            <p>{description}</p>
        </div>
    );
}
export default Error