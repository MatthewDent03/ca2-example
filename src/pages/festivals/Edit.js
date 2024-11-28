import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

const Edit = () => {
    const {token} = useAuth();
    const navigate = useNavigate();    
    const { id } = useParams();

    // Starting off with an empty object for our form
    const [form, setForm] = useState({})

    useEffect(() => {
        axios.get(`https://festivals-api.vercel.app/api/festivals/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)  
                // Making a request to get info on festivals/{id}
                // Then set our form data using that, so our fields get pre-populated              
                setForm(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])



    const handleSubmit = () => {
        axios.put(`https://festivals-api.vercel.app/api/festivals/${id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                navigate(`/festivals/${id}`, { relative: 'path', replace: true })
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
            <h1>Edit a festival</h1>
            <div>
                <input type='text' placeholder='Title' name='title' value={form.title} onChange={handleChange} />
                <input type='text' placeholder='Description' name='description' value={form.description} onChange={handleChange} />

                <select name='city' onChange={handleChange}>
                    <option value='dublin'>Dublin</option>
                    <option value='cork'>Cork</option>
                    <option value='galway'>Galway</option>
                    <option value='waterford'>Waterford</option>
                    {/* If there was some city in the existing festival, add that as an option in our select */}
                    <option value={form.city}>{form.city}</option>
                </select>

                <input value={form.start_date} type='date' name='start_date' onChange={handleChange} />

                <input value={form.end_date} type='date' name='end_date' onChange={handleChange} />

                <button onClick={handleSubmit}>Submit</button>

            </div>
        </div>
    )
}

export default Edit;