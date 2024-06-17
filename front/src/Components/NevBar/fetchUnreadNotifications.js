
import axios from 'axios';

const fetchUnreadNotifications = () => {
    return new Promise((resolve, reject) => {
        const userId = sessionStorage.getItem('userId');
        const data = {
            user_id: userId
        };

        axios.post('http://localhost:5000/count_notification', data)
            .then(response => {
                const unreadNotifications = response.data.unread_notifications;
                console.log(unreadNotifications);
                resolve(unreadNotifications);
            })
            .catch(error => {
                console.error('Error fetching unread notifications:', error);
                reject(error);
            });
    });
};

export default fetchUnreadNotifications;