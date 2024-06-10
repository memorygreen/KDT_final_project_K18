import React from 'react';
import './Article.css';

const Article = ({ article, handleImageClick, className }) => {
    return (
        <article onClick={(event) => handleImageClick(article, event)} className={`${className} card_art`}>
            <figure>
                <img src={article.POSTER_INFO.POSTER_IMG_PATH} alt="Poster" onClick={(event) => handleImageClick(article, event)} />
            </figure>
            <div className="article-details" >
                <h2>{article.MISSING_NAME}</h2>
                <p>{article.description}</p>
            </div>
        </article>
    );
};

export default Article;
