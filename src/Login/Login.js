import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AutoCompleteSearch from '../AutoCompleteSearch/AutoCompleteSearch';



const postLogin = async (name, password) => {

    const url = 'http://localhost:8080/authenticate';

        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                userName: name,
                password: password,
            })
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                return Promise.reject("Something Went wrong");
            }
            return Promise.resolve(await response.json());
        } catch (error) {
            return Promise.reject(error);
        }
};




const Login = (props) => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function handleChangeUserName(event) {
        console.log(event.target.value);
        setName(event.target.value);
    }

    function handleChangePassword(event) {
        console.log(event.target.value);
        setPassword(event.target.value);
    }

    const handleSubmit = async () => {
        console.log("submitting");

        let jwt = await postLogin(name, password);

        alert(jwt);

    }



    return (
        <Container>
            <p>Login</p>
            <Form.Control type="text" onChange={(e) => handleChangeUserName(e)}></Form.Control>
            <Form.Control type="text" onChange={(e) => handleChangePassword(e)}></Form.Control>

            <Button onClick={() => handleSubmit()}></Button>

        </Container>
    );
}

export default Login;

