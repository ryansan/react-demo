import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const AutoCompleteSearch = (props) => {
    return (
        <Autocomplete
            freeSolo
            key={props.currentUserID}
            id="free-solo-2-demo"
            disableOpenOnFocus
            size='small'
            options={props.students.map(option => option.first_name + " " + option.last_name + " - " + option.student_number)}
            onChange={(e, value) => props.setCurrentUser(value)}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Søk etter studenter her"
                    margin="normal"
                    onKeyDown={(e) => { if (e.key === 'Enter') props.addMember() }}
                    variant="outlined"
                    InputProps={{ ...params.InputProps, type: 'search' }}
                />
            )}
        />
    );
}

export default AutoCompleteSearch;

