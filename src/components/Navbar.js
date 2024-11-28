import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

const Navbar = () => {
    const {logout} = useAuth();

    const navigate = useNavigate();
    return (
        <>
            <Link to='/'>Home</Link> |
            <Link to="/doctors">Doctors</Link> |
            <Link to="/patients">Patients</Link> |
            <Link to="/appointments">Appointments</Link> |
            <Link to='/festivals'>Festivals</Link> |
            <Link to='/register'>Register</Link> |
            <Link to='/login'>Login</Link> |
            <button onClick={() => {
                logout();
                navigate('/login', { replace: true })
            }}>Logout</button>
        </> 
    );
};

export default Navbar;