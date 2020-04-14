import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AutoCompleteSearch from '../AutoCompleteSearch/AutoCompleteSearch';

const getAllStudents = async () => {
    console.log("async");
    const url = "http://localhost:9090/api/student/students";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return Promise.reject("Something Went wrong");
        }
        return Promise.resolve(await response.json());
    } catch (error) {
        return Promise.reject(error);
    }
};


const AddGroup = (props) => {

    const [students, setStudents] = useState([]);
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    const [currentUserID, setCurrentUserID] = useState(0);
    const [groupName, setGroupName] = useState("");
    const [memberIsFocused, setMemberIsFocused] = useState(false);
    const [memberToBeRemoved, setMemberToBeRemoved] = useState("");

    useEffect(() => {
        getAllStudents().then(data => { setStudents(data); console.log("data:", data); });
        console.log(students);
    }, []);

    useEffect(() => {
        if (currentUserID !== 0) {
            alert("Changed! CurrentUserID is " + currentUserID + " - " + currentUser);
            setMembers([...members, { student_id: currentUserID, name: currentUser }]);
            setCurrentUser("")
            setCurrentUserID(0);
        }
    }, [currentUserID])

    console.log("members:", members);
    console.log("Students:", students);

    //Rendering for chosen students for new group for select field
    // const listItems = members.map((m, index) =>
    //     <option key={m.student_id}>{m.name}</option>
    // );

    //Loops through list of students from server, checks if student user wants to add exists
    function addMember() {

        let alreadyAdded = false;

        members.forEach(element => {
            if (element.name === currentUser) {
                alreadyAdded = true;
            }
        });

        if (alreadyAdded) {
            alert("Studenten ligger allerede i den nye gruppa!")
            return;
        }

        console.log("This is current user ", currentUser);

        for(let element of students){
            console.log("looping...");
            let name = element.first_name + " " + element.last_name + " - " + element.student_number;
            console.log("Loop name: ", name);
            
            if (currentUser === name) {
                console.log("Found: ", element.student_id + " " + element.first_name)
                setCurrentUserID(element.student_id);
                break;
            }
        }

        console.log("Current user ", currentUser);
        console.log("CurrentUserID: ", currentUserID);
        console.log("Members: ", members);
    }

    function postGroup() {
        console.log(groupName);
        console.log("Posting group: ", groupName, " and members: ", members);
        fetch('http://localhost:9090/api/studygroup/studygroup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                groupName: groupName,
                students: members,
            })
        })
    }

    //REMOVE?
    function handleFocusedMember(e) {
        console.log(e);
        console.log(e.target.value);
        setMemberToBeRemoved(e.target.value);
    }

    //#TODO CHANGE TO REMOVE AS NORMAL
    function handleRemoveMember() {
        console.log("MTBR:  ", memberToBeRemoved);

        //members.map(option => option.map(c => console.log(c.name)));

        members.map(m => console.log(m.name))

        setMembers(members.filter(item => item.name !== memberToBeRemoved));
    }


    return (
        <Container>
            <br></br>
            <br></br>
            <Row>
                <Col><h1>Opprett en ny gruppe</h1> <p>Navnet på gruppen</p><input onChange={(e) => setGroupName(e.target.value)}></input></Col>

            </Row>
            <Row>
                <Col>
                    <h2>Legg til medlemmer</h2>
                </Col>
                <Col>
                    <h2>Medlemmer</h2>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <AutoCompleteSearch
                    addMember={addMember}
                    students={students}
                    currentUserID={currentUserID}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}>

                    </AutoCompleteSearch>
                    <Button onClick={addMember} variant="primary" type="submit">Legg til</Button>
                </Col>

                <Col>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Control as="select" multiple onChange={e => handleFocusedMember(e)} >
                            {members.map((m, index) => 
                            
                                <option onClick={() => handleRemoveMember()} key={m.student_id}>{m.name}</option>
                                
                            )}
                        </Form.Control>
                        <p>Trykk på en student for å fjerne dem fra gruppen</p>
                    </Form.Group>
                </Col>
            </Row>
            <Row>

            </Row>

            <br />
            <br />
            <br />


            <Row>
                <Col>
                    <Button variant="primary" type="submit" onClick={postGroup}> Opprett gruppe</Button>
                </Col>
            </Row>



            <br>
            </br>



        </Container>
    );
}
//Hvis det trengs {memberIsFocused && <Button variant="secondary" onMouseDown={() => handleRemoveMember()}> Fjern medlem</Button>}
export default AddGroup;

