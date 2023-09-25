import { Routes, BrowserRouter, Route } from 'react-router-dom';
import HomePage from '../../pages/home-page/home-page';
import ChatPage from '../../pages/chat-page/chat-page';
import { io }  from 'socket.io-client';
import { useState } from 'react';


const socket = io('http://localhost:4000');


function App(): JSX.Element {
  const [userName, setUserName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path='/'
          element={
            <HomePage
              userName={userName}
              setUserName={setUserName}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          }
        />

        <Route
          path='/chat'
          element={
            <ChatPage
              userName={userName}
              room={room}
              socket={socket}
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App
