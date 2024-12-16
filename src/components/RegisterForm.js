import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/register.scss';

const RegisterForm = (props) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`https://festivals-api.vercel.app/api/users/register`, form)
            .then((res) => {
                console.log(res);

                localStorage.setItem('user', JSON.stringify(res.data.user));

                login(form.email, form.password);

                navigate('/');

            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input onChange={handleChange} value={form.first_name} type="text" name="first_name" id="first_name" placeholder="Joe" />
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input onChange={handleChange} value={form.last_name} type="text" name="last_name" id="last_name" placeholder="Bloggs" />
            </div>
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

export default RegisterForm;
