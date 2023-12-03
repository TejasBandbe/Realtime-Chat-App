import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import styled from 'styled-components';
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { log } from '../utils/env';
import { GoArrowLeft } from "react-icons/go";
import { BiX } from "react-icons/bi";
import Logout from '../components/Logout';
import axios from "axios";
import { updateNameRoute, updateEmailRoute, updatePasswordRoute, deleteUserRoute, getUserRoute } from '../utils/APIRoutes';
import ServerDown from '../components/ServerDown';

function Profile() {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [name, setName] = useState('null');
  const [email, setEmail] = useState('null');
  const [oldpass, setOldPass] = useState('');
  const [newpass, setNewPass] = useState('');

  const toastOptions = {
    autoClose:1500, 
    position: "top-center",
    pauseOnHover: false,
    draggable: true,
    theme: "dark"
  }

  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
      history.push("/login");
    }else{
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
      const id = user._id;
      async function fetchUser() {
        await axios.get(`${getUserRoute}/${id}`)
        .then(res => {
          if(res.data.status === true){
            setCurrentUser(res.data.user);
          }
        })
        .catch(err => {
          log(err);
          setIsLive(false);
        });
    }
    fetchUser();
    }
  },[]);

  // useEffect(() => {

  // }, [name, email, oldpass, newpass, currentUser]);

  const fetchUser = async () => {
        setIsLive(true);
        await axios.get(`${getUserRoute}/${currentUser._id}`)
        .then(res => {
          if(res.data.status === true){
            setCurrentUser(res.data.user);
          }
        })
        .catch(err => {
          log(err);
          setIsLive(false);
        });
  };

  const goToChat = () => {
    history.push("/");
  };

  const funcName = () => {
    setShowNameModal(!showNameModal);
    setName(currentUser.username);
  };

  const changeName = async () => {
    if(name.length >= 3){
    await axios.put(`${updateNameRoute}/${currentUser._id}`, {
      username: name,
    })
    .then(res => {
      if(res.data.status === false){
        toast.error(res.data.msg, toastOptions);
      }
      if(res.data.status === true){
        toast.success(res.data.msg, toastOptions);
        localStorage.setItem("chat-app-user", JSON.stringify(res.data.userData));
        fetchUser();
        history.push("/profile");
      }
    })
    .catch(err => {
      log(err);
      setIsLive(false);
    });
  }else{
    toast.error("username must be atleast 3 characters long", toastOptions);
  }
    setShowNameModal(false);
  };

  const funcEmail = () => {
    setShowEmailModal(!showEmailModal);
    setEmail(currentUser.email);
  };

  const changeEmail = async () => {
    await axios.put(`${updateEmailRoute}/${currentUser._id}`, {
      email,
    })
    .then(res => {
      if(res.data.status === false){
        toast.error(res.data.msg, toastOptions);
      }
      if(res.data.status === true){
        toast.success(res.data.msg, toastOptions);
        localStorage.setItem("chat-app-user", JSON.stringify(res.data.userData));
        fetchUser();
        history.push("/profile");
      }
    })
    .catch(err => {
      log(err);
      setIsLive(false);
    });
    setShowEmailModal(false);
  };

  const changePass = async () => {
    if(oldpass.length === 0 || newpass.length === 0){
      toast.error("both fields are required", toastOptions);
    }
    else{
      await axios.put(`${updatePasswordRoute}/${currentUser._id}`, {
        oldpass,
        newpass,
      })
      .then(res => {
        if(res.data.status === false){
          toast.error(res.data.msg, toastOptions);
        }
        if(res.data.status === true){
          toast.success(res.data.msg, toastOptions);
          localStorage.setItem("chat-app-user", JSON.stringify(res.data.userData));
          fetchUser();
          history.push("/profile");
        }
      })
      .catch(err => {
        log(err);
        setIsLive(false);
      });
      setShowPassModal(false);
    }
  };

  const deactivate = async () => {
    await axios.delete(`${deleteUserRoute}/${currentUser._id}`)
    .then(res => {
      if(res.data.status === false){
        toast.error(res.data.msg, toastOptions);
      }
      if(res.data.status === true){
        toast.success(res.data.msg, toastOptions);
        localStorage.clear();
        history.push("/login");
      }
    })
    .catch(err => {
      log(err);
      setIsLive(false);
    });
    setShowDeactivateModal(false);
  };

  const DeactivateModal = () => {
    return(
      <Modal>
      <div className="modal-wrapper"></div>
      <div className='modal'>
        <div className="modal-title">
          <h2>Are You Sure?</h2>
          <div className='close-btn' onClick={() => {setShowDeactivateModal(false)}}>
            <BiX/>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={() => {deactivate()}}>Yes</button>
          <button onClick={() => {setShowDeactivateModal(false)}}>No</button>
        </div>
      </div>
      </Modal>
    )
  }

  return (<>
  { isLive ? (<>
{showDeactivateModal && <DeactivateModal/>}
    <Container>
      <div className='box'>
      <div className="header">
        <div className="back-arrow" onClick={goToChat}>
            <GoArrowLeft/>
        </div>
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentUser.avatarImage}`} alt="avatar"/>
          </div>
          <div className="username">
            <h3>{currentUser.username}</h3>
          </div>
        </div>
        <Logout/>
      </div>

      <div className="body">
        <div className="buttons" onClick={() => funcName()}>
        Update Name
        </div>
        {showNameModal && 
        <div className='modal'>
        <div className="modal-title">
          <h2>Update Your Username</h2>
          <div className='close-btn' onClick={() => {setShowNameModal(false)}}>
            <BiX/>
          </div>
        </div>
        <div className="modal-body">
          <input type="text" id="" placeholder="enter new username" value={name}
          onChange={(e) => {setName(e.target.value)}}/>
        </div>
        <div className="modal-footer">
          <button onClick={() => {changeName()}}>Submit</button>
        </div>
      </div>}
        <div className="buttons" onClick={() => funcEmail()}>
        Update Email id
        </div>
        {showEmailModal && 
        <div className='modal'>
        <div className="modal-title">
          <h2>Update Your Email Id</h2>
          <div className='close-btn' onClick={() => {setShowEmailModal(false)}}>
            <BiX/>
          </div>
        </div>
        <div className="modal-body">
          <input type="email" placeholder='enter new email id' value={email}
           onChange={(e) => {setEmail(e.target.value)}}/>
        </div>
        <div className="modal-footer">
          <button onClick={() => {changeEmail()}}>Submit</button>
        </div>
      </div>}
        <div className="buttons" onClick={() => setShowPassModal(!showPassModal)}>
        Change Password
        </div>
        {showPassModal && 
        <div className='modal'>
        <div className="modal-title">
          <h2>Update Your Password</h2>
          <div className='close-btn' onClick={() => {setShowPassModal(false)}}>
            <BiX/>
          </div>
        </div>
        <div className="modal-body">
          <input type="password" placeholder='enter old password'
            onChange={(e) => {setOldPass(e.target.value)}}/>
          <input type="password" placeholder='enter new password'
            onChange={(e) => {setNewPass(e.target.value)}}/>
        </div>
        <div className="modal-footer">
          <button onClick={() => {changePass()}}>Submit</button>
        </div>
      </div>}
        <div className="buttons" onClick={() => setShowDeactivateModal(true)}>
        Deactivate account
        </div>
      </div>
      </div>
    </Container>
    <ToastContainer/> </>) : (
      <ServerDown/>
    )
        }</>
  )
}

const Modal = styled.div`
  display: flex;
  justify-content: center;
  .modal-wrapper{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(19,19,36,0.9);
  }
  .modal{
    margin-top: 3rem;
    position: fixed;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #9a86f3;
    padding: 2rem;
    border-radius: 2rem;
    @media screen and (max-width: 12000px){
      width: 60%;
    }
    @media screen and (max-width: 720px){
      width: 90%;
      padding: 1rem;
    }
    .modal-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      @media screen and (max-width: 720px){
        font-size: 0.8rem;
      }
      .close-btn{
        padding: 0.5rem;
        margin-left: auto;
        cursor: pointer;
        svg{
          font-size: 2rem;
          @media screen and (max-width: 720px){
            font-size: 1.5rem;
          }
        }
      }
    }
    .modal-footer{
      display: flex;
      gap: 2rem;
      flex-direction: row;
      button{
        padding: 0.5rem;
        border-radius: 10px;
        cursor: pointer;
        background-color: #131324;
        color: white;
        font-size: 1rem;
      }
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  .box{
  display: grid;
  height: 80vh;
  width: 40vw;
  grid-template-rows: 15% 85%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (max-width: 1400px){
    width: 60vw;
  }
  @media screen and (max-width: 720px){
    width: 90vw;
    height: 90vh;
  }
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #0d0d30;
    .back-arrow{
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
  .body{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    padding-top: 2rem;
    background-color: #0d0d30;
    .buttons{
      text-align: center;
      width: 50%;
      background-color: #9a86f3;
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
        width: 80vw;
        font-size: 0.8rem;
      }
    }
    .modal{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      background-color: #9a86f3;
      padding: 1rem;
      border-radius: 2rem;
      @media screen and (max-width: 720px){
        gap: 0.5rem;
      }
      .modal-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
        @media screen and (max-width: 720px){
          font-size: 0.8rem;
        }
        .close-btn{
          padding: 0.5rem;
          margin-left: auto;
          cursor: pointer;
          svg{
            font-size: 2rem;
            @media screen and (max-width: 720px){
              font-size: 1.3rem;
            }
          }
        }
      }
      .modal-body{
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        input{
          width: 80%;
          padding: 0.8rem;
          border-radius: 10px;
          font-size: 1.2rem;
          @media screen and (max-width: 720px){
            padding: 0.6rem;
          }
        }
      }
      .modal-footer{
        display: flex;
        gap: 2rem;
        flex-direction: row;
        button{
          padding: 0.5rem;
          border-radius: 10px;
          cursor: pointer;
          background-color: #131324;
          color: white;
          font-size: 1rem;
          @media screen and (max-width: 720px){
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}
`;

export default Profile