import React, { useEffect, useRef } from 'react';
import AnimatedLinksObjs from './animatedLink';
import './AnimatedLinks.css'; // Ensure you have your styles here

const AnimatedLinks = () => {
    const linksRef = useRef([]);

    useEffect(() => {
        linksRef.current.forEach((el, index) => {
            const fxObj = AnimatedLinksObjs[index];
            fxObj && new fxObj(el);
        });
    }, []);

    return (
        <div className='main_ppp'>
        <nav className="menu menu--linethrough">
            <a className="menu__link menu__link--1" href="#" ref={el => linksRef.current[0] = el}>Where</a>
            <a className="menu__link menu__link--2" href="#" ref={el => linksRef.current[1] = el}>is</a>
            <a className="menu__link menu__link--3" href="#" ref={el => linksRef.current[2] = el}>Willy?</a>
        </nav>
        </div>
    );
};

export default AnimatedLinks;
