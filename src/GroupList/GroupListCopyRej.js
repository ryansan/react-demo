import React, { useEffect, useState } from "react";
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../storeContext/StoreContext";
const getAllGroups = async () => {
  console.log("getting all groups..");
  const url = "http://localhost:9090/api/student/student/1/groups";

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

const GroupList = props => {
  console.log("Start");
  //const response = getAllGroups();
  const history = useHistory();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { myGroupCalendarState, myGroupCalendarDispatch } = useContext(
    StoreContext
  );

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = group => {
    setShow(true);
    setSelectedGroup(group);
  };

  useEffect(() => {
    getAllGroups().then(data => setGroups(data));
  }, []);

  /* useEffect(() => {
    //getAllGroups().then(data => setGroups(data));
  }, [groups]);
 */
  useEffect(() => {
    console.log("Show changed, getting all groups again");
    if (selectedGroup != null) {
      console.log("Show changed, selectgroup not null: ", selectedGroup);
    }
    getAllGroups().then(data => setGroups(data));
  }, [show]);

  useEffect(() => {
    if (selectedGroup != null) {
      console.log("SelGroup changed ", selectedGroup);
    }
    //response.then(data => setGroups(data));
  }, [selectedGroup]);

  function handleChangeGroupName(event) {
    console.log(event.target.value);
    //setSelectedGroup({...selectedGroupTest})

    setSelectedGroup({ ...selectedGroup, groupName: event.target.value });

    //  selectedGroup.groupName = event.target.value;
    console.log("State_:", selectedGroup.groupName);
  }

  function updateGroup() {
    putGroup();
    //GET FROM API AGAIN
    //getAllGroups().then(data => setGroups(data));
    handleClose();
  }

  function putGroup() {
    console.log(selectedGroup);
    console.log(
      "Posting group: ",
      selectedGroup.groupName,
      " and members: ",
      selectedGroup.members
    );
    fetch("http://localhost:9090/api/studygroup//studygroup/put", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selectedGroup)
    });
  }

  function openGroup(studyGroupCalendar) {
    console.log(studyGroupCalendar);
    myGroupCalendarDispatch({
      type: "setGroupCalendar",
      payload: studyGroupCalendar
    });

    //history.push("/myGroup");
    //alert("SGCal: " + JSON.stringify(studyGroupCalendar));
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
                    <Link
                      className="nav-item nav-link"
                      to={{
                        pathname: "/myGroup",
                        aboutProps: { value: group }
                      }}
                    >
                      <Button
                        onClick={e => openGroup(group)}
                        style={{ margin: "0.5em" }}
                        size="sm"
                      >
                        Åpne gruppen
                      </Button>
                    </Link>
                  </Col>
                  <Col>
                    <Button
                      style={{ margin: "0.5em" }}
                      size="sm"
                      variant={"secondary"}
                      onClick={() => handleShow(group)}
                    >
                      Rediger
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {selectedGroup && (
        <Form>
          <Modal style={{ marginTop: "10%" }} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                Redigerer gruppe:
                <Form.Control
                  type="text"
                  onChange={e => handleChangeGroupName(e)}
                  defaultValue={selectedGroup.groupName}
                ></Form.Control>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Studenter i gruppen</p>
              <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Control as="select" multiple>
                  {selectedGroup.students.map((m, index) => (
                    <option key={m.student_id}>{m.first_name}</option>
                  ))}
                </Form.Control>
                <p>Trykk på en student for å fjerne dem fra gruppen</p>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Lukk
              </Button>
              <Button variant="primary" onClick={updateGroup}>
                Lagre
              </Button>
            </Modal.Footer>
          </Modal>
        </Form>
      )}
    </Container>
  );
};

export default GroupList;
