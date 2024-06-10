import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import imagesLoaded from 'imagesloaded';
import Article from '../Card/Article';
import './CardColums.css';

const CardColums = ({ posters, handleImageClick }) => {
    const gridRef = useRef([]);
    const lenisRef = useRef(null);
    gsap.registerPlugin(ScrollTrigger);

    const preloadImages = (selector = 'img') => {
        return new Promise((resolve) => {
            imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
        });
    };

    const initSmoothScrolling = () => {
        if (!lenisRef.current) {
            lenisRef.current = new Lenis({
                lerp: 0.15,
                smoothWheel: true
            });

            lenisRef.current.on('scroll', () => ScrollTrigger.update());

            const scrollFn = (time) => {
                lenisRef.current.raf(time);
                requestAnimationFrame(scrollFn);
            };

            requestAnimationFrame(scrollFn);
        }
    };

    const scrollAnimations = (columns, mergedItems) => {
        columns.forEach((column, pos) => {
            gsap.to(column, {
                yPercent: -1 * pos * 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: column,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        mergedItems.forEach((item) => {
            gsap.fromTo(item.image, {
                y: 0
            }, {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: item.element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    };

    useEffect(() => {
        if (posters.length > 0) {
            preloadImages('.Poster_column img').then(() => {
                const grids = gridRef.current.filter(Boolean); // Filter out any null entries
                if (!grids.length) {
                    console.error('Grid elements not found');
                    return;
                }

                const items = grids.map((grid) => {
                    const columns = [...grid.querySelectorAll('.column')];
                    return columns.map((item, pos) => ({
                        element: item,
                        column: pos,
                        wrapper: item.querySelector('column figure'),
                        image: item.querySelector('column figure')
                    }));
                });
                const mergedItems = items.flat();

                try {
                    initSmoothScrolling();
                    scrollAnimations(grids, mergedItems);
                    document.body.classList.remove('loading');
                } catch (error) {
                    console.error('Error initializing scroll animations:', error);
                }
            }).catch(error => {
                console.error('Error preloading images:', error);
            });
        }
    }, [posters]);

    return (
        <div className="columns">
            {Array.from({ length: 3 }).map((_, i) => (
                <div className="column" ref={el => { if (el) gridRef.current[i] = el }} key={i}>
                    {posters.filter((_, index) => index % 3 === i).map((poster, index) => (
                        <Article
                            className="column_item"
                            key={index}
                            article={poster}
                            handleImageClick={handleImageClick}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CardColums;
