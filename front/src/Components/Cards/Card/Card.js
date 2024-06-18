// src/components/Card/Card.js

import React, { useEffect, useState } from 'react';
import './Card.css';
import axios from 'axios';
import CardColums from '../CardColums/CardColums';

const Card = ({ onImageClick }) => {
    const [posters, setPosters] = useState([]);

    useEffect(() => {
        axios.get('/missing_info')
            .then(response => {
                setPosters(response.data);
            }).catch(error => {
                console.error('There was a problem with the axios operation:', error);
            });
    }, []);

    return (
        <div className='Card_body'>
            <div className='Card_columns'>
                <CardColums posters={posters} handleImageClick={onImageClick} />
            </div>
        </div>
    );
};

export default Card;
