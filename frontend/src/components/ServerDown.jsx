import React from 'react';
import styled from 'styled-components';
import { constants } from '../utils/env';

function ServerDown() {
  return (
    <Container>
      <div className="message">
        {constants.SERVER_DOWN_MESSAGE1}
        <br/>
        {constants.SERVER_DOWN_MESSAGE2}
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #131324;
  display: flex;
  justify-content: center;
  align-items: center;
  .message{
    text-align: center;
    padding: 4rem;
    font-size: 3rem;
    background-color: #9186f3;
    border-radius: 2rem;
  }
  @media screen and (max-width: 720px){
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    .message{
        font-size: 1.5rem;
        padding-top: 3rem;
        padding-bottom: 3rem;
        margin-bottom: 10rem;
    }
  }
`;

export default ServerDown