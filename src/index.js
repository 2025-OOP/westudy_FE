import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App'; // 예: 홈 페이지
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import reportWebVitals from './reportWebVitals';
import Mypage from './Pages/Mypage';
import Meetlist from './Pages/Meetlist';
import { UserProvider } from './Components/UserContext';
import MeetPage from './Pages/MeetPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path='meetlist' element={ <Meetlist/> } />
        <Route path='meetpage' element={ <MeetPage/> } />
      </Routes>
    </BrowserRouter>
  </UserProvider>
);

reportWebVitals();
