import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ServerDown from '../components/ServerDown';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";
import { log } from '../utils/env';

function Chat() {
  const socket = useRef();
  const history = useHistory();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gridStyle, setGridStyle] = useState({
    gridTemplateColumns: '100% 0%',
  });
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
      history.push("/login");
    }else{
      setIsLive(true);
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
      setIsLoaded(true);
    }
  },[]);

  useEffect(() => {
    if(currentUser){
      setIsLive(true);
      socket.current = io(host);  
      socket.current.emit("add-user", currentUser._id);
    }else{
      setIsLive(false);
    }
  },[currentUser]);

  useEffect(() => {
    async function fetchContacts() {
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          await axios.get(`${allUsersRoute}/${currentUser._id}`)
          .then(res => {
            setContacts(res.data);
          })
          .catch(err => {
            setIsLive(false);
            log(err);
          });
        }
        else{
          history.push("/setAvatar");
        }
      }
    }
    fetchContacts();
  },[currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    openChatWindow();
  };

  const openChatWindow = () => {
    if (window.innerWidth < 720) {
      setGridStyle({
        gridTemplateColumns: '0% 100%',
      });
    }
  };

  const closeChatWindow = () => {
    if (window.innerWidth < 720) {
      setGridStyle({
        gridTemplateColumns: '100% 0%',
      });
    }
  }

  return (
    <>{ isLive ? (
    <Container>
      {
        window.innerWidth > 720 ? (
        <div className="container" style={{gridTemplateColumns: '25% 75%'}}>

        <Contacts contacts={contacts} currentUser={currentUser} 
        changeChat={handleChatChange}/>

        {
          isLoaded && currentChat === undefined ?
          (<Welcome currentUser={currentUser}/>) :
          (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />)
        }

      </div>
        ) : (
        <div className="container" style={gridStyle}>

        <Contacts contacts={contacts} currentUser={currentUser} 
        changeChat={handleChatChange}/>

        {
          isLoaded && currentChat === undefined ?
          (<Welcome currentUser={currentUser}/>) :
          (<ChatContainer currentChat={currentChat} currentUser={currentUser} 
            socket={socket} closeChatWindow={closeChatWindow}/>)
        }

      </div>
        )
      }
      
    </Container> ) : (
      <ServerDown/>
    )
  }</>
)
}

const Container = styled.div`
  height: 100vh;
  widht: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;

  }
`;

export default Chat