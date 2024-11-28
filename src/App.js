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
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;