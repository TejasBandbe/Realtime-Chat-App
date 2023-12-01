import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import loader from "../assets/loader.gif";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from "buffer";
import { constants, log } from '../utils/env';
import ServerDown from '../components/ServerDown';
import AvatarNotFound from '../components/AvatarNotFound';

function SetAvatar() {
    const api = constants.MULTIAVATAR_API;
    const history = useHistory();
    
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [isLive, setIsLive] = useState(true);
    const [inLimit, setInLimit] = useState(true);

    const toastOptions = {
        autoClose:1500, 
        position: "top-center",
        pauseOnHover: false,
        draggable: true,
        theme: "dark"
      }
    
    const setProfilePicture = async() => {
        if(selectedAvatar === undefined){
            toast.error("please select an avatar", toastOptions);
        }
        else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            })
            .then(res => {
                if(res.data.isSet){
                    user.isAvatarImageSet = true;
                    user.avatarImage = res.data.image;
                    localStorage.setItem("chat-app-user", JSON.stringify(user));
                    history.push("/");
                }else{
                    toast.error("error setting avatar. please try again", toastOptions);
                }
            })
            .catch(err => {
                log(err);
                setIsLive(false);
            });
            
        }
    };

    useEffect(() => {
        if(!localStorage.getItem("chat-app-user")) {
            history.push("/login");
        }
        async function fetchAvatars() {
        const arr = [];
        for(let i=0; i<4; i++){
            await axios.get(`${api}/${Math.round(Math.random()*1000)}`)
            .then(res => {
                const buffer = new Buffer(res.data);
                arr.push(buffer.toString("base64"));
            })
            .catch(err => {
                log(err);
                if(err.response.status === 429){
                    setInLimit(false);
                }
            });
        }
        setAvatars(arr);
        setIsLoading(false);
        }
        fetchAvatars();
        setIsLive(true);
      },[]);

  return (<>
  { isLive ? ( inLimit ? (
    <>
    {
        isLoading ? <Container>
            <img src={loader} alt="loader" className='loader'/>
        </Container> : (

<Container>
    <div className="title-container">
        <h1>Pick and avatar as your profile picture</h1>
    </div>
    <div className="avatars">
        {
            avatars.map((avatar, index) => {
                return(
                    <div key={index} className={`avatar ${
                        selectedAvatar === index ? "selected" : ""
                    }`}>
                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                    onClick={() => {setSelectedAvatar(index)}}/>
                    </div>  
                )
            })
        }
    </div>
    <button className='submit-btn' onClick={setProfilePicture}>Set as profile picture</button>
</Container>
)}
<ToastContainer/>
    </> ) : (
        <AvatarNotFound/>
    )) : (
        <ServerDown/>
    )
    }</>
  );
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    @media screen and (max-width: 720px){
        gap: 1rem;
      }
    .loader{
        max-inline-size: 100%;
        @media screen and (max-width: 720px){
            max-inline-size: 60%;
          }
    }

    .title-container{
        h1{
            color: white;
            @media screen and (max-width: 720px){
                font-size: 1.5rem;
                text-align: center;
              }
        }
    }
    .avatars{
        display: flex;
        @media screen and (max-width: 720px){
            flex-direction: column;
            gap: 0;
          }
        gap: 2rem;
        .avatar{
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            transition: 0.5sec ease-in-out;
            img{
                height: 6rem;
                @media screen and (max-width: 720px){
                    height: 4rem;
                  }
            }
        }
        .selected{
            border: 0.4rem solid #4e0eff;
        }
    }
    .submit-btn{
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover{
        background-color: #4e0eff;
      }
    }
`;

export default SetAvatar