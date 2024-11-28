import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/useAuth";

const SingleFestival = (props) => {
    // No longer pulling this directly from localStorage, the context does that for us, and stores it in its state
    const {token} = useAuth();

    const [festival, setFestival] = useState(null)

    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://festivals-api.vercel.app/api/festivals/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res)
                setFestival(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    return festival && (
        <div>
            <Link to={`edit`}>
                Edit festival
            </Link>
            <h1>{festival.title}</h1>
            <h2>{festival.city}</h2>
            <p>{festival.description}</p>
            <div>
                <span>Start date: {festival.start_date}</span>
                <br />
                <span>End date: {festival.end_date}</span>
            </div>
        </div>
    )
}

export default SingleFestival;