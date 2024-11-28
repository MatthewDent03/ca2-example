
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../utils/useAuth';



// const DoctorEdit = () => {
//     return (
//         <h1>hello this is doctors edit</h1>
//     )
// };

// export default DoctorEdit;

import { useEffect, useState } from "react"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

const DoctorEdit = () => {
    const {token} = useAuth();
    const navigate = useNavigate();    
    const { id } = useParams();

    // Starting off with an empty object for our form
    const [form, setForm] = useState({})

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
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
        axios.put(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                navigate(`/doctors/${id}`, { relative: 'path', replace: true })
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
            <h1>Edit a doctor</h1>
            <div>
                <input type='text' placeholder='first name' name='first_name' value={form.first_name} onChange={handleChange} />
                <input type='text' placeholder='last name' name='last_name' value={form.last_name} onChange={handleChange} />
                <input type='text' placeholder='email' name='email' value={form.email} onChange={handleChange} />
                <input type='text' placeholder='phone' name='phone' value={form.phone} onChange={handleChange} />

                <select name='specialisation' onChange={handleChange}>
                    <option value='Podiatrist'>Podiatrist</option>
                    <option value='Dermatologist'>Dermatologist</option>
                    <option value='General Practitioner'>General Practitioner</option>
                    <option value='Pediatrician'>Pediatrician</option>
                    <option value='Psychiatrist'>Psychiatrist</option>
                    {/* If there was some city in the existing festival, add that as an option in our select */}
                    <option value={form.specialisation}>{form.specialisation}</option>
                </select>

                <button onClick={handleSubmit}>Submit</button>

            </div>
        </div>
    )
}

export default DoctorEdit;