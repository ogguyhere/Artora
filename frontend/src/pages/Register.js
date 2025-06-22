import React, {useState} from 'react';
import axios from 'axios';

function Register(){
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register',form);
            alert(res.data.msg);
        }catch(err)
        {
            alert(err.response?.data?.msg||"Error");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name ="name" placeholder='Name' onChange={handleChange}/>
                <input name='email' type='email' placeholder='Email' onChange={handleChange}/>
                <input name='password' type='password' placeholder='Password' onChange={handleChange}/>
                <select name='role' onChange={handleChange}>
                    <option value='buyer'>Buyer</option>
                    <option value='artist'>Artist</option>
                </select>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}

export default Register;  //export the component