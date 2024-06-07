// LinkFxComponent.js
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

const useLinkFx = (elRef, options, filterId) => {
    useEffect(() => {
        if (!elRef.current) return;

        const el = elRef.current;
        const text = document.createElement('span');
        text.className = 'menu__link-inner';
        text.innerHTML = el.innerHTML;
        el.innerHTML = '';
        el.appendChild(text);

        const line = document.createElement('span');
        line.className = 'menu__link-deco';
        el.appendChild(line);

        const animationOptions = {
            text: el.dataset.text !== 'false',
            line: el.dataset.line !== 'false',
            ...options
        };

        const tl = gsap.timeline({
            paused: true,
            onStart: () => {
                if (animationOptions.line) {
                    line.style.filter = `url(${filterId})`;
                }
                if (animationOptions.text) {
                    text.style.filter = `url(${filterId})`;
                }
            },
            onComplete: () => {
                if (animationOptions.line) {
                    line.style.filter = 'none';
                }
                if (animationOptions.text) {
                    text.style.filter = 'none';
                }
            }
        });

        tl.to(text, {
            duration: 0.6,
            y: -20,
            ease: 'power1.out'
        }).to(line, {
            duration: 0.6,
            scaleX: 1.2,
            ease: 'power1.out'
        }, 0);

        el.addEventListener('mouseenter', () => tl.restart());
        el.addEventListener('mouseleave', () => tl.reverse());

        return () => {
            el.removeEventListener('mouseenter', () => tl.restart());
            el.removeEventListener('mouseleave', () => tl.reverse());
        };
    }, [elRef, options, filterId]);
};

const LinkFxComponent = ({ className, href, children, filterId, animationOptions }) => {
    const linkRef = useRef(null);
    useLinkFx(linkRef, animationOptions, filterId);

    return (
        <a ref={linkRef} className={className} href={href}>
            {children}
        </a>
    );
};

export default LinkFxComponent;
