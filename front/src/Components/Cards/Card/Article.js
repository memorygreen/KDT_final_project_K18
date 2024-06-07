// src/components/Article/Article.js

import React from 'react';

const Article = ({ article, handleImageClick }) => {
    if (!article.POSTER_INFO.POSTER_IMG_PATH) return null;

    return (
        <article onClick={(event) => handleImageClick(article, event)} className='card_art'>
            <figure>
                <img src={article.POSTER_INFO.POSTER_IMG_PATH} alt="Poster" onClick={(event) => handleImageClick(article, event)} />
            </figure>
            <div className="article-preview">
                <h2>{article.MISSING_NAME}</h2>
                <p>{article.description}</p>
            </div>
        </article>
    );
};

export default Article;
