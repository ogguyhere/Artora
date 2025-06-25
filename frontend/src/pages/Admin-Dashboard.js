import React from 'react';

function AdminDashboard()
{
    const user = JSON.parse(localStorage.getItem('user'));
    return(
        <div className='container py-5'>
            <h2 className='text-orchid'>Admin Dashboard</h2>
            <p className='text-orchid'> Welcome, {user?.name} ! You are logged In!</p>

        </div>
    );
}
export default AdminDashboard