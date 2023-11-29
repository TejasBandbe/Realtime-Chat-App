import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { allUsersRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';

function Chat() {
  const history = useHistory();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
      history.push("/login");
    }else{
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
    }
  },[]);

  useEffect(() => {
    async function fetchContacts() {
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
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
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}/>

        <Welcome currentUser={currentUser}/>
      </div>
    </Container>
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
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat