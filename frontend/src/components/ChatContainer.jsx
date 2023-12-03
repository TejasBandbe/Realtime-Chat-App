import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid";
import { GoArrowLeft } from "react-icons/go";
import { log } from '../utils/env';

function ChatContainer({currentChat, currentUser, socket, closeChatWindow}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
      if(socket.current) {
        socket.current.on("msg-receive", (msg)=>{
          setArrivalMessage({fromSlef: false, message: msg});
        });
      }
  }, []);

  useEffect(() => {
    if(currentChat){
    const delay = 10;

    const timerId = setTimeout(async() => {
      await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      })
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => {
        log(err);
      });
    }, delay);

    return () => clearTimeout(timerId);
  }
  }, [currentChat]);

  const handleSendMsg = async(msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    })
    .then(res => {
      log(res);
    })
    .catch(err => {
      log(err);
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({fromSelf:true, message:msg});
    setMessages(msgs);
  };

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  },[arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviour: "smooth"});
  },[messages]);

  return (
    <>
{
    currentChat && (
    <Container>
      <div className="chat-header">
        <div className="back-arrow" onClick={closeChatWindow}>
            <GoArrowLeft/>
        </div>
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar"/>
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout/>
      </div>
      <div className="chat-messages">
        {
          messages.map((message) => {
            return(
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.fromSelf ? "sended" : "received"}`}>
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>

      <ChatInput handleSendMsg={handleSendMsg}/>
    </Container>
    )
}
    </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px){
    grid-template-row: 15% 70% 15%;
  }
  .chat-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #0d0d30;
    .back-arrow{
      display: none;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      svg{
        font-size: 1.3rem;
        color: white;
        @media screen and (max-width: 720px){
          font-size: 1rem;
        }
      }
      @media screen and (max-width: 720px){
        display: flex;
      }
    }
    .user-details{
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar{
            img{
                height: 3rem;
                @media screen and (max-width: 720px){
                  height: 2rem;
                }
            }
        }
        .username{
          h3{
            color: white;
            @media screen and (max-width: 720px){
              font-size: 1rem;
            }
          }
        }
      }
  }
  .chat-messages{
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar{
      width: 0.2rem;
      &-thumb{
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media screen and (max-width: 720px){
      gap: 0.4rem;
      padding: 1rem 1rem;
    }
    .message{
      display: flex;
      align-items: center;
      .content{
        max-width: 60%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (max-width: 720px){
          max-width: 90%;
          padding: 0.6rem;
          font-size: 1rem;
        }
      }
    }
    .sended{
      justify-content: flex-end;
      .content{
        background-color: #3D3560;
      }
    }
    .received{
      justify-content: flex-start;
      .content{
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer