import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Form, Button } from 'react-bootstrap';
import AutoCompleteSearch from '../AutoCompleteSearch/AutoCompleteSearch';


const getAllGroups = async () => {
    console.log("getting all groups..");
    const url = "http://localhost:9090/api/student/student/2/groups";

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

const GroupList = (props) => {
    console.log("Re-rendering...");

    const [groups, setGroups] = useState([]);
    const [groupsCopyForRevert, setGroupsCopyForRevert] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    
    console.log("Re-rendering after init...");
    if(groups!=null)console.log("Groups: ", groups);

    const [allStudents, setAllStudents] = useState([]);

    //For autocompletesearch
    const [currentUser, setCurrentUser] = useState("");
    const [currentUserID, setCurrentUserID] = useState(0);
    const [members, setMembers] = useState([]);

    const [show, setShow] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToBeRemoved, setStudentToBeRemoved] = useState(null);

    const handleClose = () => {
        setShow(false)
        setSelectedGroup(null);
        console.log("Closed now", groups);
    };

    const abortEditClose = () => {
        setShow(false)
        setSelectedGroup(null);
        console.log("B4 abort", groups)
        console.log("Aborting, ", groupsCopyForRevert);
        console.log("TYpe of c", typeof groupsCopyForRevert);
        console.log("TYpe of g", typeof groups);
        setGroups(groupsCopyForRevert);
    };

    const handleShow = (group) => {
        setShow(true);
        setSelectedGroup(group)
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    useEffect(() => {
        //CurrentUserID has been changed, if != 0, add the new student for the group
        //with values from currenetUserID and currentUser and push to selectedGroup
        //NOTE: only first_name is because currentUser has a value eg: "Ola Nordmann - s1233456"
        //No need to splice/cut the name and set values, only student_id is needed for PUT in backend
        //and at least one name value (first_name) to display user in list of students in "EditGroupModal"
        if (currentUserID !== 0) {
            const temp = selectedGroup;
            var obj = { student_id: currentUserID, first_name: currentUser };
            temp.students.push(obj);
            console.log(temp);
            setSelectedGroup(temp);

            setCurrentUser("")
            setCurrentUserID(0);
        }
    }, [currentUserID]);

    useEffect(() => {
        //Run at render, get all groups and set groups. Also set a copy of this list.
        //If the user wants to cancel changes, groupsCopyForRevert is used to revert changes
        getAllGroups().then(data => setGroups(data));
        setGroupsCopyForRevert(...groups);
        getAllStudents().then(data => setAllStudents(data));
    }, []);

    useEffect(() => {
        //Groups have been changed, groupsCopyForRevert also needs to change

        console.log("TYpe of g", typeof groups);
        console.log("UseEffect Groups changed: ", groups);
        console.log("Setting copy...");
        var tempArray = JSON.parse(JSON.stringify(groups));
        setGroupsCopyForRevert(tempArray);
        console.log(groupsCopyForRevert);
    }, [groups]);

    /*FOR DEBUGGING*/
    useEffect(() => {
        //getAllGroups().then(data => setGroups(data));
        console.log("SELGROUP: UseEffect: ", selectedGroup);
        console.log("GRUPS NOW: ", groups);
        console.log("And copy:", groupsCopyForRevert);

        let temp = selectedGroup;
        temp.test = "hei";
        console.log(test);

    }, [selectedGroup]);

    /*FOR DEBUGGING*/
    useEffect(() => {
        console.log("Show changed");
        if (selectedGroup != null) {
            console.log("Show changed, selectgroup not null: ", selectedGroup);
        }
    }, [show]);

    /*FOR DEBUGGING*/
    useEffect(() => {
        if (selectedGroup != null) {
            console.log("SelGroup changed ", selectedGroup);
        }
        //response.then(data => setGroups(data));
    }, [selectedGroup]);

    /*FOR DEBUGGING*/
    useEffect(() => {
        console.log("GroupsCopyForRevert ", groupsCopyForRevert);
    }, [groupsCopyForRevert]);

    /*
    Gets an event and sets value to 
    */
    function handleChangeGroupName(event) {
        console.log(event.target.value);
        setSelectedGroup({ ...selectedGroup, groupName: event.target.value });
        console.log("State_:", selectedGroup.groupName);
    }

    function updateGroup() {
        putGroup();
        //GET FROM API AGAIN

        //getAllGroups().then(data => setGroups([...data]));
        handleClose();
    }

    function putGroup() {
        console.log(selectedGroup);
        console.log("Posting group: ", selectedGroup.groupName, " and students: ", selectedGroup.students);
        fetch('http://localhost:9090/api/studygroup//studygroup/put', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedGroup)
        }).then(respone => {
            respone.json().then(data => {
                console.log("Data from server: ", data);

                const tempGroups = [...groups];
                var studyGroupFromServer = data;

                tempGroups.forEach(function (item, i) {
                    if (item.study_group_id == studyGroupFromServer.study_group_id) tempGroups[i] = studyGroupFromServer;
                });

                console.log("OLD: ", groups);
                console.log("new: ", tempGroups);

                setGroups(tempGroups);
            })
        })
    }

    function handleClickToRemoveStudent(student) {
        console.log("removing", student);
        setShowDeleteModal(true);
        setStudentToBeRemoved(student);
    }

    function handleRemoveStudent(){
        console.log("DEleting form state", studentToBeRemoved);

        var tempGroup = {...selectedGroup};

        console.log("B4 del:", tempGroup);
        //tempGroup.students.filter(item => item.student_number !== studentToBeRemoved.student_number);
        const index = tempGroup.students.indexOf(studentToBeRemoved);
        tempGroup.students.splice(index,1);
        console.log("After del:", tempGroup);

        setSelectedGroup(tempGroup);

        //setSelectedGroup(selectedGroup.students.filter(item => item.student_number !== studentToBeRemoved.student_number));
        setShowDeleteModal(false);
    }

    function addMember() {
        console.log("Adding");
        let alreadyAdded = false;

        console.log("Students:", selectedGroup.students);
        console.log("curr user", currentUser);
        selectedGroup.students.forEach(element => {
            console.log("Comparing: ");

            let name = "";

            if (element.last_name != null) {
                name = element.first_name + " " + element.last_name + " - " + element.student_number;
            } else {
                name = element.first_name;
            }
            console.log(name);
            console.log("with: ", currentUser);
            if (name === currentUser) {
                alreadyAdded = true;
            }
        });

        if (alreadyAdded) {
            alert("Studenten er allerede med i gruppen!")
            return;
        }

        console.log("This is current user ", currentUser);

        for (let element of allStudents) {
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
        console.log("Student Members: ", selectedGroup.students);
    }

    const mystyle = {
        border: "1px solid gray"
    };

    return (
        <Container>
            <div>
                <Row>
                    <Col>
                        <h1>Dine grupper</h1>
                    </Col>
                </Row>

                <Row>
                    {groups.map(group => (
                        <Col key={group.study_group_id}>
                            <div style={mystyle}>
                                <h2>{group.groupName}</h2>
                                <Row>
                                    <Col>
                                        <Button style={{ margin: "0.5em" }} size="sm">
                                            Åpne gruppen
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button style={{ margin: "0.5em" }} size="sm" variant={"secondary"} onClick={() => handleShow(group)}>
                                            Rediger
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    ))}

                </Row>

            </div>

            {selectedGroup &&
                <Form>
                    <Modal show={show} onHide={abortEditClose}>

                        <Modal.Header closeButton>
                            <Modal.Title>Redigerer gruppe:
                        <Form.Control type="text" onChange={(e) => handleChangeGroupName(e)} defaultValue={selectedGroup.groupName}></Form.Control>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Studenter i gruppen</p>
                            <AutoCompleteSearch
                                addMember={addMember}
                                students={allStudents}
                                currentUserID={currentUserID}
                                currentUser={currentUser}
                                setCurrentUser={setCurrentUser}>
                            </AutoCompleteSearch>
                            <Form.Group controlId="exampleForm.ControlSelect2">
                                <Form.Control as="select" multiple  >
                                    {selectedGroup.students.map(m => {
                                        if (m.last_name != null) {
                                            return <option onClick={(e) => handleClickToRemoveStudent(m)} key={m.student_id}>{m.first_name + " " + m.last_name + " - " + m.student_number}</option>;
                                        } else {
                                            return <option onClick={(e) => handleClickToRemoveStudent(m)}>{m.first_name}</option>;
                                        }
                                    }
                                    )}
                                </Form.Control>
                                <p>Trykk på en student for å fjerne dem fra gruppen</p>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={abortEditClose}>
                                Avbryt
                    </Button>
                            <Button variant="primary" onClick={updateGroup}>
                                Lagre
                    </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>}

                {showDeleteModal && <Form>
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>

                <Modal.Header closeButton>
                    <p>Sletting</p>
                </Modal.Header>
                <Modal.Body>
                <p>Er du sikker på at du vil fjerne {studentToBeRemoved.first_name + " " + studentToBeRemoved.last_name} fra gruppen?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleRemoveStudent}>
                        Slett
                    </Button>
                </Modal.Footer>
            </Modal>
        </Form>}
        </Container>
    );
}

export default GroupList;

