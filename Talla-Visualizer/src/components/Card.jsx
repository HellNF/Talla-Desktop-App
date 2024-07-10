
import React from 'react';

const Card = ({children}) => {
    return (
        <>
            <div className='bg-gray-600 rounded-md p-4 h-auto w-fit flex items-center justify-center'>
                {children}
            </div>
        </>
    );
};

export default Card;