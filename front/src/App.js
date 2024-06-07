import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* pages */
import NotFound from './Page/NotFound/NotFound';
import Login from './Page/LoginPage/Login';
import Mappage from './Page/MapPage/Mappage';
import Signup from './Page/SignUpPage/SignUp';
import MainPage from './Page/MainPage/MainPage';
import SerchMissing from './Page/SearchMissingPage/SearchMissingPage' /** 자영 추가*/
import Adminpage from './Page/Adminpage/Adminpage';
import Adminmanage from './Page/Adminmanage/Adminmanage';
import Admincctv from './Page/Admincctv/Admincctv';
import Adminmissing from './Page/Adminmissing/Adminmissing';
import ReportNotificationPage from './Page/NotificationPage/ReportNotificationPage';
import CaptureNotificationPage from './Page/NotificationPage/CaptureNotificationPage';

/* Test용 Components */
import KakaoMap from './Components/Map/KakaoMap';
import Sidebar from './Components/SideBar/SideBar';
import Nevbar from './Components/NevBar/NevBar';
import KakaoLogin from './Components/KakaoLogin/KakaoLogin';
import Card from './Components/Cards/Card/Card';
import OpenAI from './Components/OpenAI/OpenAI';
import ViewCCTVPage from './Page/ViewCCTVPage/ViewCCTVpage';
import { ViewMissingListPage } from './Page/ViewMissingListPage/ViewMissingListPage';
import { MyPage } from './Page/MyPage/Mypage';
import SearchMissingUpdatePage from './Page/SearchMissingUpdatePage/SearchMissingUpdatePage';


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
          <Route path='/SearchMissingPage' element={<SerchMissing />} /> {/* 자영 추가*/}
          <Route path='/Adminpage' element={<Adminpage />}/>
          <Route path="/Adminmanage" element={<Adminmanage />} />
          <Route path="/Admincctv" element={<Admincctv />} />
          <Route path="/Adminmissing" element={<Adminmissing />} />
          <Route path="/ReportNotificationPage" element={<ReportNotificationPage />} />
          <Route path="/ViewCCTVPage/:cctvId" element={<ViewCCTVPage />} />
          <Route path="/MyPage" element={<MyPage/>} />
          <Route path="/ViewMissingListPage/:userId" element={<ViewMissingListPage />} />
          <Route path="/SearchMissingUpdatePage/:missingIdx" element={<SearchMissingUpdatePage />} />
          <Route path="/CaptureNotificationPage" element={<CaptureNotificationPage/>} />
          
          

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
