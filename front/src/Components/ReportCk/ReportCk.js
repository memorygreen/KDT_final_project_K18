//ReportCk.js
import axios from 'axios';

export const reportCk = async (userId) => {
    
    
    if (!userId) {
        console.error('User is not logged in');
        return;
    }

    try {
        const response = await axios.post('http://localhost:5000/my_report', {
            user_id: userId // user_id를 함께 전송
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
   
        console.log('ReportCk successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error ReportCk:', error);
        throw error;
    }
};

// 알림 리스트를 받아오고 UI에 표시하는 함수
// export const fetchNotifications = async (userId) => {
//     if (!userId) {
//         console.error('User is not logged in');
//         return;
//     }

//     try {
//         const response = await axios.post('http://localhost:5000/my_report', {
//             user_id: userId
//         }, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         // 반환된 데이터를 알림 리스트로 변환하여 UI에 표시
//         const notifications = response.data;
//         displayNotifications(notifications);
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         throw error;
//     }
// };

// // 알림 리스트를 UI에 표시하는 함수
// export const displayNotifications = (notifications) => {
//     const notificationContainer = document.getElementById('notification-container');

//     notifications.forEach(notification => {
//         const notificationElement = document.createElement('div');
//         notificationElement.classList.add('notification');

//         const notificationHeader = document.createElement('div');
//         notificationHeader.classList.add('notification-header');
//         notificationHeader.textContent = '제보알림';

//         const notificationContent = document.createElement('div');
//         notificationContent.classList.add('notification-content');
//         notificationContent.textContent = `post_idx의 제보입니다: ${notification.POSTER_IDX}`;

//         //아랫줄을 클릭하면 세부 정보를 표시
//         notificationContent.addEventListener('click', () => {
//             displayNotificationDetails(notification);
//         });

//         notificationElement.appendChild(notificationHeader);
//         notificationElement.appendChild(notificationContent);
//         notificationContainer.appendChild(notificationElement);
//     });
// };

// //알림의 세부 정보를 표시하는 함수
// const displayNotificationDetails = (notification) => {
//     // 세부 정보를 표시할 UI 요소들을 생성하고 채우는 코드를 작성
// };
