import React from 'react';
import { MemoryRouter as Router, Route, Routes as Routers, Redirect } from "react-router";
import { createBrowserHistory } from "history";
import Login from './Login'
import Home from "./Home"
import Signup from './Signup';
import MainPage from './MainPage';

const history = createBrowserHistory()

class Routes extends React.Component {
    constructor() {
        super();
    }

    render() {

        return (
            <div style={{width: "100%", "height": "100%"}}>
                <Router>
                    <Routers>
                        <Route exact path='/' element={<Home/>} />
                        <Route path='/login' element={<Login/>} />
                        <Route path='/signup' element={<Signup/>} />
                        <Route path='/main' element={<MainPage />} />
                    </Routers>
                </Router>
            </div>
        );
    }
}

export default Routes