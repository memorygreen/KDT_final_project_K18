import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* pages */
import NotFound from './Page/NotFound/NotFound';
import Login from './Page/LoginPage/Login';
import Mappage from './Page/MapPage/Mappage';
import Signup from './Page/SignUpPage/SignUp';
import MainPage from './Page/MainPage/MainPage';

/* Test용 Components */
import KakaoMap from './Components/Map/KakaoMap';
import Sidebar from './Components/SideBar/SideBar';
import Nevbar from './Components/NevBar/NevBar';
import KakaoLogin from './Components/KakaoLogin/KakaoLogin';
import Card from './Components/Cards/Card';
import OpenAI from './Components/OpenAI/OpenAI';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* pages */}
          <Route path="/" element={<MainPage />} />
          <Route path="/Mappage" element={<Mappage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />

          
          {/* Test용 Components */}
          <Route path="/Map" element={<KakaoMap />} />
          <Route path="/Side" element={<Sidebar />} />
          <Route path="/Nevbar" element={<Nevbar />} />
          <Route path="/Login/Kakao" element={<KakaoLogin />} />
          <Route path='/Card' element={<Card />} />
          <Route path='/OpenAI' element={<OpenAI />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
