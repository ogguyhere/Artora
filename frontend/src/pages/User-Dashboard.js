import React from 'react';

function UserDashboard(){
    const user = JSON.parse(localStorage.getItem('user'));
    return(
        <div className='container py-5'>
            <h2 className='text-orchid'>User Dashboard </h2>
            <p className='text-dusty-rose'> Hi {user?.name}, welcome to your dashboard</p>
        </div>
    );
}

export default UserDashboard;