import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import AutoCompleteSearch from '../AutoCompleteSearch/AutoCompleteSearch';

const getStoredGroupMessages = async (studyGroupID) => {
    console.log("async");
    const url = "http://localhost:9092/chatapi/conversation/conversation/" + studyGroupID;
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

const Chat = (props) => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [stompClientState, setStompClientState] = useState({});

    const [userName, setUserName] = useState("");
    const [studentID, setStudentID] = useState();
    const [chatSessionID, setChatSessionID] = useState();
    const [student, setStudent] = useState({});

    var ryan = {
        id: 1,
        student_id: 3,
        first_name: "Ryanjit",
        last_name: "Sangha",
        student_number: "s326149",
        fieldOfStudy: "IT"
    }

    var kari = {
        id: 1,
        student_id: 5,
        first_name: "Kari",
        last_name: "Haugen",
        student_number: "s326969",
        fieldOfStudy: "Anvendt"
    }

    var stompClient = null;
    var currentSubscription;
    var topic = null;

    useEffect(() => {
        //Run at render, start chat
        //connect();
        console.log(student);
        getStoredGroupMessages(81).then(data => setMessages(data.chatMessages));
        setStudent(ryan)
    }, []);


    useEffect(() => {
        //Run at render, start chat
        console.log("Messaged changed!");
        console.log(messages);
    }, [messages]);

    useEffect(() => {
        //Run at render, start chat
        console.log("student changed!");
        console.log(student);
    }, [student]);

    //Connect to WebSocket, with values for display name and StudyGroupID for 
    function connect() {
        var name1 = userName
        window.Cookies.set('name', name1);

        var socket = new window.SockJS('http://localhost:9092/sock');
        stompClient = window.Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
        setStompClientState(stompClient);
    }

    console.log(student);

    //Set up chat
    function enterChat() {
        console.log("CSID", chatSessionID);
        var roomId = chatSessionID;
        window.Cookies.set('roomId', roomId);
        topic = 'http://localhost:9092/chat-app/chat/' + chatSessionID;//TOPIC

        currentSubscription = stompClient.subscribe('/topic/' + roomId, onMessageReceived);//TOPIC
        /* console.log("Entering chat");
         console.log(stompClient);
         console.log("uname", userName);
         console.log("SCID", chatSessionID);
         console.log("StudentID", studentID);
 
         var tempMessage = {
             content: message.content,
             student: {
                 id: message.student.id,
                 student_id: message.student.student_id,
                 first_name: message.student.first_name,
                 last_name: message.student.last_name,
                 student_number: message.student.student_number,
                 fieldOfStudy: message.student.fieldOfStudy
             }
         }
 
         //Har student object
         stompClient.send('/chat-app/chat/' + chatSessionID 
         + '/addUser', {}, JSON.stringify({ sender: userName, type: 'JOIN', studentID: studentID })
         );*/
    }

    function sendMessage(event) {
        console.log("Sender", event.target.value);
        var messageContent = event.target.value;

        topic = `/chat-app/chat/${chatSessionID}`;//TOPIC

        //CLGS
        console.log("Sender ", messageContent);
        console.log("til ", topic);
        console.log("stomp: ", stompClient);
        console.log("Stom state: ", stompClientState);
        ///

        if (messageContent && stompClientState) {
            var chatMessage = {
                sender: student.first_name,
                content: messageContent,
                type: 'CHAT',
                studentID: student.student_id
            };

            stompClient = stompClientState;
            console.log("Final message", chatMessage);
            stompClient.send(`${topic}/sendMessage`, {}, JSON.stringify(chatMessage));
        } else {
            console.error("Message not set or stopmclient not set");
        }
    }

    function onMessageReceived(payload) {
        console.log("Message recieved!!!!");
        console.log(payload);
        var message = JSON.parse(payload.body);

        //DRY??
        if (message.type === 'JOIN') {
            console.log(message.sender + " connected");
            //message.content = message.sender + ' joined!';
            //setMessages(messages => [...messages, message]);
        } else if (message.type === 'LEAVE') {
            console.log(message.sender + " disconnected");
            //message.content = message.sender + ' left!';
            //setMessages(messages => [...messages, message]);
        } else {
            /*var tempMessage = {
                chat_Message_id: 0,
                content: message.content,
                sentDate: message.sentDate,
                sentTime: message.sentTime,
                student: {
                    id: message.student.id,
                    student_id: message.student.student_id,
                    first_name: message.student.first_name,
                    last_name: message.student.last_name,
                    student_number: message.student.student_number,
                    fieldOfStudy: message.student.fieldOfStudy
                }
            }*/

            setMessages(messages => [...messages, message]);
        }

        //Scroll funcitonality?
        // var messageArea = document.querySelector('#messageArea');
        // messageArea.appendChild(divCard);
        // messageArea.scrollTop = messageArea.scrollHeight;
    }

    function onConnected() {
        console.log("Connected");
        setConnected(true);
        enterChat();
    }

    function onError(error) {
        console.log("Error");
    }

    //handle user name
    function handleNameChoice(event) {
        console.log(event.target.value);
        setUserName(event.target.value);
    }

    function handleStudentIDChoice(event) {
        console.log(event.target.value);
        setStudentID(event.target.value);
    }

    //Change chat session id (studygroup id)
    function handleSessionIDChoice(event) {
        console.log(event.target.value);
        setChatSessionID(event.target.value);
    }

    //Connect to chat
    function handleConnectClick() {
        connect();
    }

    function handleChangeStudent(){
        console.log(student);
        setStudent(kari);
    }


    //key={message.request_id}

    return (
        <Container>
            <p>Chat</p>
            <Container>
                <Col>



                    {connected && messages.length > 0 ? messages.map(message =>
                        <Col >
                            <Col sm={5} style={{ borderRadius: '25px', border: "1px solid gray", margin: "1em" }}>
                                <div >
                                    <Row>
                                        {message.sender ?
                                            <div>
                                                {
                                                    message.sender === userName ?
                                                        <div style={{ float: 'right' }}>
                                                            <p>s{message.sender}: {message.content}</p>
                                                        </div>
                                                        :
                                                        <div style={{ textAllign: 'left', float: 'left' }}>
                                                            <p>{message.sender}: {message.content}</p>
                                                        </div>
                                                }
                                            </div>
                                            :
                                            <div style={{ float: 'right' }}>
                                                <p>{message.student.first_name} {message.sentDate}-{message.sentTime}: {message.content}</p>
                                            </div>
                                        }

                                    </Row>
                                </div>
                            </Col>





                        </Col>
                    ) : <p>Laster inn meldingene...</p>}



                    <Form.Control
                        type="text"
                        placeholder="msg"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                sendMessage(event)
                            }
                        }}
                    />

                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>

                    <Form.Control
                        placeholder="Navn"
                        type="text"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                handleNameChoice(event)
                            }
                        }}
                    />

                    <Form.Control
                        placeholder="studentID"
                        type="text"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                handleStudentIDChoice(event)
                            }
                        }}
                    />



                    <Form.Control
                        placeholder="StudyGroupID"
                        type="text"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                handleSessionIDChoice(event)
                            }
                        }}
                    />

                    <Button onClick={() => handleConnectClick()}>Connect to chat</Button>
                    <Button onClick={() => handleChangeStudent()}>Bytt student til kari</Button>
                

                </Col>



            </Container>
        </Container>
    );
}

export default Chat;

