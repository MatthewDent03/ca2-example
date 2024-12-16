import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/login.scss'; // Import your custom SCSS file

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();        

        login(form.email, form.password)
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                console.error('Login failed:', err);
                alert('Login failed, please check your credentials');
            });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input onChange={handleChange} value={form.email} type="email" name="email" id="email" placeholder="joe.bloggs@email.com" />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input onChange={handleChange} value={form.password} type="password" name="password" id="password" />
            </div>
            <button className="submit-button" type="submit">Submit</button>
        </form>
    );
}

export default LoginForm;
