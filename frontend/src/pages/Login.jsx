import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/chat.png";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';
import { constants, log } from '../utils/env';
import ServerDown from '../components/ServerDown';

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if(localStorage.getItem("chat-app-user")) {
      history.push("/");
    }
  },[]);

  const history = useHistory();

  const toastOptions = {
    autoClose:1500, 
    position: "top-center",
    pauseOnHover: false,
    draggable: true,
    theme: "dark"
  }

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    if(handleValidation()){
      const{password, username} = values;
      await axios.post(loginRoute, {
        username,
        password
      })
      .then(res => {
        if(res.data.status === false){
        
          toast.error(res.data.msg, toastOptions);
        }
        if(res.data.status === true){
          
          localStorage.setItem('chat-app-user', JSON.stringify(res.data.user));
          history.push("/setAvatar");
        }  
      })
      .catch(err => {
        log(err);
        setIsLive(false);
      });
    }
  }

  const handleValidation = () => {
    const{password, username} = values;
    if(username==="" || password===""){
      toast.error("username and password are required", toastOptions);
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    setValues({...values, [event.target.name]:event.target.value });
  };

  return (
    <>{ isLive ? (
      <>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="Logo" />
          <h1>{constants.WEBSITE_NAME}</h1>
        </div>
        <input type="text" placeholder='username' name='username' min='3' onChange={e => handleChange(e)}/>
        <input type="password" placeholder='password' name='password' onChange={e => handleChange(e)}/>
        <button type="submit">Login</button>
        <span>Don't have an account?</span>
        <span><Link to="/register">Register</Link></span>
      </form>
    </FormContainer>
    <ToastContainer/> </> ) : (
      <ServerDown/>
    )
  }</>
 )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  @media screen and (max-width: 720px){
    gap: 0.7rem;
    padding-bottom: 10rem;
  }
  .brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img{
      height: 5rem;
      @media screen and (max-width: 720px){
        height: 3rem;
      }
    }
    h1{
      color: white;
      @media screen and (max-width: 720px){
        font-size: 1.5rem;
      }
    }
  }
  form{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    @media screen and (max-width: 720px){
      gap: 1rem;
    }
    input{
      background-color: transparent;
      padding: 1rem;
      border: 0.2rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus{
        border: 0.1rem solid #997af0;
        outline: none;
      }
      @media screen and (max-width: 720px){
        padding: 0.6rem;
      }
    }
    button{
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
      @media screen and (max-width: 720px){
        padding: 0.6rem;
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
      }
    }
    span{
      color: white;
      text-align: center;
      text-transform: uppercase;
      @media screen and (max-width: 720px){
        font-size: 0.8rem;
      }
      a{
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Login