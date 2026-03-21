import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Api } from "../contextApi/api"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard";
import DashboardEdit from "../pages/Dashboard-Edit";

const Paths = () => {
    return (
        <>
        <Api>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/editar" element={<DashboardEdit />} />
        </Routes>
        </BrowserRouter>
        </Api>
        </>
    );
}

export default Paths;