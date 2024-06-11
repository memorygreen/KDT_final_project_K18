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
// import UserDelete from './Page/UserDelete/UserDelete';
import UserUpdate from './Components/MyPage/My_modify/UserUpdate'; // UserUpdate 컴포넌트 파일 경로 수정


/* Test용 Components */
import KakaoMap from './Components/Map/KakaoMap';
import Sidebar from './Components/SideBar/SideBar';
import Nevbar from './Components/NevBar/NevBar';
import KakaoLogin from './Components/KakaoLogin/KakaoLogin';
import Card from './Components/Cards/Card/Card';
import ViewCCTVPage from './Page/ViewCCTVPage/ViewCCTVpage';
import { ViewMissingListPage } from './Page/ViewMissingListPage/ViewMissingListPage';
import SearchMissingUpdatePage from './Page/SearchMissingUpdatePage/SearchMissingUpdatePage';
import Mypage from './Components/MyPage/Mypage';


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
          <Route path='/Adminpage' element={<Adminpage />} />
          <Route path="/Adminmanage" element={<Adminmanage />} />
          <Route path="/Admincctv" element={<Admincctv />} />
          <Route path="/Adminmissing" element={<Adminmissing />} />
          {/* <Route path='/UserDelete' element={<UserDelete />}/> */}
          <Route path="/UserUpdate" element={<UserUpdate />} /> {/* UserUpdate 컴포넌트를 호출하는 경로 추가 */}
          <Route path="/ViewCCTVPage/:cctvId" element={<ViewCCTVPage />} />
          <Route path="/ViewMissingListPage/:userId" element={<ViewMissingListPage />} />
          <Route path="/SearchMissingUpdatePage/:missing_idx" element={<SearchMissingUpdatePage />} />

          {/* Test용 Components */}
          <Route path="/Map" element={<KakaoMap />} />
          <Route path="/Side" element={<Sidebar />} />
          <Route path="/Nevbar" element={<Nevbar />} />
          <Route path="/Login/Kakao" element={<KakaoLogin />} />
          <Route path='/Card' element={<Card />} />
          <Route path='/Mypage' element={<Mypage />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
