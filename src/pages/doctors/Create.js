
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../utils/useAuth';



// const DoctorCreate = () => {
//     return (
//         <h1>hello this is doctors create</h1>
//     )
// };

// export default DoctorCreate;

import { useEffect, useState } from "react"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/useAuth";

const DoctorCreate = () => {
const { token } = useAuth();
console.log("Token:", token);  // Ensure token is not null/undefined

    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialisation: ''
    })

    const handleSubmit = () => {
        axios.post(`https://fed-medical-clinic-api.vercel.app/doctors`, form, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res.data)
                // We treat navigating routes like navigating a file system
                // We've got to go up one level using '../' to get back to /festivals/{id} from here
                // (we're currently at /festivals/create)                
                navigate(`../${res.data._id}`, { relative: 'path' })
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
            <h1>Create a doctor</h1>
            <div>
                <input type='text' placeholder='first name' name='first_name' value={form.first_name} onChange={handleChange} />

                <input type='text' placeholder='last name' name='last_name' value={form.last_name} onChange={handleChange} />

                <input type='text' placeholder='email' name='email' value={form.email} onChange={handleChange} />

                <input type='text' placeholder='phone' name='phone' value={form.phone} onChange={handleChange} />

                <select name='specialisation' onChange={handleChange}>
                    <option value='Podiatrist'>Podiatrist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="General Practitioner">General Practitioner</option>
                    <option value='Pediatrician'>Pediatrician</option>
                    <option value='Psychiatrist'>Psychiatrist</option>
                </select>





                <button onClick={handleSubmit}>Submit</button>

            </div>
        </div>
    )
}

export default DoctorCreate;