import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Api } from "../pages/ContextApi/api"

import Home from "../pages/Home"

const Paths = () => {
    return (
        <>
        <Api>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
        </BrowserRouter>
        </Api>
        </>
    );
}

export default Paths;