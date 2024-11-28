import { useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";

const Create = () => {
    const {token} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: '',
        description: '',
        city: 'Dublin',
        start_date: '',
        end_date: ''
    })

    const handleSubmit = () => {
        axios.post(`https://festivals-api.vercel.app/api/festivals`, form, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                // We treat navigating routes like navigating a file system
                // We've got to go up one level using '../' to get back to /festivals/{id} from here
                // (we're currently at /festivals/create)                
                navigate(`../${res.data._id}`, {relative: 'path'})
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleChange = (e) => {
        setForm(({
            ...form,
            [e.target.name]: e.target.value
        }))
    }


    return (
        <div>
            <h1>Create a festival</h1>
            <div>
                <input type='text' placeholder='Title' name='title' value={form.title} onChange={handleChange} />
                <input type='text' placeholder='Description' name='description' value={form.description} onChange={handleChange} />

                <select name='city' onChange={handleChange}>
                    <option value='dublin'>Dublin</option>
                    <option value='cork'>Cork</option>
                    <option value='galway'>Galway</option>
                    <option value='waterford'>Waterford</option>
                </select>

                <input type='date' name='start_date' onChange={handleChange} />

                <input type='date' name='end_date' onChange={handleChange} />

                <button onClick={handleSubmit}>Submit</button>

            </div>
        </div>
    )
}

export default Create;