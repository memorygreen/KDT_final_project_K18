// MainPage.js
import React from 'react';
import NevBar from '../../Components/NevBar/NevBar';
import styles from './MainPage.module.css';
import Card from '../../Components/Cards/Card/Card';
import LinkFxComponent from './LinkFxComponenet';

const MainPage = () => {
    const filters = [
        '#filter-1', '#filter-2', '#filter-3'
    ];
    const links = ['Where', 'is', 'Willy'];

    return (
        <div className={styles.Nev_Card}>
            <header className={styles.nevibar_card}> <NevBar /></header>
            <div className={styles.main_wave}>
                <nav className={styles.menu}>
                    {links.map((link, index) => (
                        <LinkFxComponent
                            key={index}
                            className={styles.menu__link}
                            href="#"
                            filterId={filters[index]}
                            animationOptions={{ text: true, line: true }}
                        >
                            {link}
                        </LinkFxComponent>
                    ))}
                </nav>
            </div>
            <div className='Main_card'>
                <Card />
            </div>
            <svg className="hidden">
                <defs>
                    <filter id="filter-1">
                        <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="warp" />
                        <feOffset dx="-90" result="warpOffset" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
                    </filter>
                    <filter id="filter-2">
                        <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="10" result="warp" />
                        <feOffset dx="-90" result="warpOffset" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="60" in="SourceGraphic" in2="warpOffset" />
                    </filter>
                    <filter id="filter-3">
                        <feTurbulence type="fractalNoise" baseFrequency="0.15 0.02" numOctaves="3" result="warp" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />
                    </filter>
                    <filter id="filter-4">
                        <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="5" result="warp" />
                        <feOffset dx="-90" result="warpOffset" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="35" in="SourceGraphic" in2="warpOffset" />
                    </filter>
                    <filter id="filter-5">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.7" numOctaves="5" result="warp" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="0" in="SourceGraphic" in2="warp" />
                    </filter>
                    <filter id="filter-6">
                        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.07" numOctaves="5" seed="2" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="warp" scale="0" xChannelSelector="R" yChannelSelector="B" />
                    </filter>
                    <filter id="filter-7">
                        <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="5" result="warp" />
                        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="90" in="SourceGraphic" in2="warp" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default MainPage;
