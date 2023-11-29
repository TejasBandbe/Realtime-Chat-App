import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';

function App() {
  return (
    <div className="page-container">
      <div className="content-wrap">
    <Router>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/setAvatar" component={SetAvatar}/>
        <Route exact path="/" component={Chat}/>
    </Router>
    </div>
    </div>
  );
}

export default App;
