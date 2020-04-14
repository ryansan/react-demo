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




const HomePage = (props) => {

    const [user, setUser] = useState({});
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

    const postLogin = async (name, password) => {

        const url = 'http://localhost:8080/login';
    
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

    useEffect(() => {
        //Run at render, get all groups and set groups. Also set a copy of this list.
        //If the user wants to cancel changes, groupsCopyForRevert is used to revert changes
        console.log(user);
        if(Object.keys(user).length === 0){
            console.log("user null, redirecting");
            postLogin("","");
            //window.location.assign('http://localhost:8080/login');
        }
    }, []);



    return (
        <Container>
            <p>Homepage</p>
            <p>Hei </p>

        </Container>
    );
}

export default HomePage;

