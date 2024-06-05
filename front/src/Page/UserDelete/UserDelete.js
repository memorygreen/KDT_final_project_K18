import { useEffect } from "react";
import './UserDelete.css';
import NevBar from '../../Components/NevBar/NevBar';
import axios from 'axios';

const UserDelete = () => {
    useEffect(() => {
        const userId = sessionStorage.getItem('userId'); // 세션에서 userId 가져오기

        axios.post('/UserDelete', { userId }) // post 요청으로 userId 전송
            .then(response => console.log(response.data))
            .catch(error => console.error(error));
    }, []); 
    
    return (
        <div>
            <NevBar />
        </div>
    )
}

export default UserDelete;
