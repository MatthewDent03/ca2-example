import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import '../styles/navbar.scss'; 

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to='/' className="nav-link">Home</Link>
            <Link to="/doctors" className="nav-link">Doctors</Link>
            <Link to="/patients" className="nav-link">Patients</Link>
            <Link to="/appointments" className="nav-link">Appointments</Link>
            <Link to="/diagnoses" className="nav-link">Diagnoses</Link>
            <Link to="/prescriptions" className="nav-link">Prescriptions</Link>
            <Link to='/festivals' className="nav-link">Festivals</Link>
            <Link to='/register' className="nav-link">Register</Link>
            <Link to='/login' className="nav-link">Login</Link>
            <button
                className="logout-button"
                onClick={() => {
                    logout();
                    navigate('/login', { replace: true })
                }}
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
