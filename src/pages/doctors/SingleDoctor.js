
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../utils/useAuth';



// const SingleDoctor = () => {
//     return (
//         <h1>hello this is doctors index</h1>
//     )
// };

// export default SingleDoctor;

import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

const SingleDoctor = (props) => {
    // No longer pulling this directly from localStorage, the context does that for us, and stores it in its state
    const {token} = useAuth();

    const [doctor, setDoctor] = useState(null)

    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://fed-medical-clinic-api.vercel.app/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                setDoctor(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    return doctor && (
        <div>
            <Link to={`edit`}>
                Edit doctor
            </Link>
            <h1>{doctor.first_name}{doctor.last_name}</h1>
            <h2>{doctor.specialisation}</h2>
            <p>{doctor.email} / {doctor.phone}</p>
        </div>
    )
}

export default SingleDoctor;