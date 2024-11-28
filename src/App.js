import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FestivalsIndex from './pages/festivals/Index';
import SingleFestival from "./pages/festivals/SingleFestival";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from './components/ProtectedRoute'
import Create from './pages/festivals/Create';
import Edit from './pages/festivals/Edit'
import { AuthProvider } from "./utils/useAuth";
import DoctorsIndex from './pages/doctors/Index';
import CreateDoctor from './pages/doctors/Create';
import EditDoctor from './pages/doctors/Edit';
import ViewDoctor from './pages/doctors/View';

import PatientsIndex from './pages/patients/Index';
import CreatePatient from './pages/patients/Create';
import EditPatient from './pages/patients/Edit';
import ViewPatient from './pages/patients/View';

import AppointmentsIndex from './pages/appointments/Index';
import CreateAppointment from './pages/appointments/Create';
import EditAppointment from './pages/appointments/Edit';
import ViewAppointment from './pages/appointments/View';

const App = () => {

    // We wrap the entire app in the auth provider
    // We no longer need to pass the auth state down from here, all our routes can get it from the context instead
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Festival routes */}
                    <Route path="/festivals" element={<FestivalsIndex />} />
                    <Route path='/' element={<ProtectedRoute />}>
                        <Route path='/festivals/create' element={<Create />} />
                        <Route path='/festivals/:id/edit' element={<Edit />} />
                        <Route path='/festivals/:id' element={<SingleFestival />} />
                    </Route>
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/register' element={<RegisterForm />} />

                    {/* Clinic routes */}
                    {/* Doctors Routes */}
                    <Route path="/doctors" element={<DoctorsIndex />} />
                    <Route path="/doctors/create" element={<CreateDoctor />} />
                    <Route path="/doctors/:id/edit" element={<EditDoctor />} />
                    <Route path="/doctors/:id" element={<ViewDoctor />} />

                    {/* Patients Routes */}
                    <Route path="/patients" element={<PatientsIndex />} />
                    <Route path="/patients/create" element={<CreatePatient />} />
                    <Route path="/patients/:id/edit" element={<EditPatient />} />
                    <Route path="/patients/:id" element={<ViewPatient />} />

                    {/* Appointments Routes */}
                    <Route path="/appointments" element={<AppointmentsIndex />} />
                    <Route path="/appointments/create" element={<CreateAppointment />} />
                    <Route path="/appointments/:id/edit" element={<EditAppointment />} />
                    <Route path="/appointments/:id" element={<ViewAppointment />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;