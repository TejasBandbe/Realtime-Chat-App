import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput({handleSendMsg}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    setShowEmojiPicker(false);
    if(msg.length > 0){
      handleSendMsg(msg);
      setMsg('');
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className='input-container' onSubmit={(e) => sendChat(e)}>
        <textarea placeholder='type your message here' value={msg} rows={1}
        onChange={(e)=> setMsg(e.target.value)} onClick={() => setShowEmojiPicker(false)}/>
        <button className='submit'>
            <IoMdSend/>
        </button>
      </form>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 720px) and (max-width: 1080px){
    padding: 0 1rem;
    gap: 1rem;
  }
  @media screen and (max-width: 720px){
    padding: 0rem;
    padding-left: 1rem;
    grid-template-columns: 10% 90%;
  }
  .button-container{
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji{
        position: relative;
        svg{
            font-size: 1.5rem;
            color: #ffff00c8;
            cursor: pointer;
        }
        .emoji-picker-react {
            position: absolute;
            top: -350px;
            background-color: #080420;
            box-shadow: 0 5px 10px #9a86f3;
            border-color: #9a86f3;
            .emoji-scroll-wrapper::-webkit-scrollbar{
              background-color: #808420;
              width: 5px;
              &-thumb{
                background-color: #9a86f3;
              }
            }
            .emoji-categories{
              button{
                filter: contrast(0);
              }
            }
            .emoji-search{
              background-color: transparent;
              border-color: #9a86f3;
            }
            .emoji-group:before{
              background-color: #080420;
            }
        }
    }
  }
  .input-container{
    width: 90%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    @media screen and (max-width: 720px){
      width: 95%;
      gap: 0.5rem;
    }
    textarea{
        width: 90%;
        height: 60%;
        background-color: transparent;
        color: white;
        border: none;
        padding-left: 1rem;
        font-size: 1.2rem;
        resize: none;
        &::selection{
            background-color: #9a86f3;
        }
        &:focus{
            outline: none;
        }
        &::-webkit-scrollbar{
          width: 0.2rem;
          &-thumb{
            background-color: #ffffff39;
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
        @media screen and (max-width: 720px){
          width: 100%;
          padding-left: 0.4rem;
          font-size: 1rem;
        }
    }
    button{
        padding: 0.3rem 1rem;
        border-radius: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #9a86f3;
        border: none;
        @media screen and (min-width: 720px) and (max-width: 1080px){
          padding: 0.3rem 0.8rem;
          svg{
            font-size: 1rem;
          }
        }
        @media screen and (max-width: 720px){
          padding: 0.5rem 0.7rem;
        }
        svg{
            font-size: 2rem;
            color: white;
            @media screen and (max-width: 720px){
              font-size: 1.3rem;
            }
        }
    }
  }
`;

export default ChatInput