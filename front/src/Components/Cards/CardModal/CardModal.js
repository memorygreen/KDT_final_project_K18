import React from 'react';
import closeIcon from '../assets/xxx.png';
import './CardModal.css'; // 모달 스타일이 필요하면 추가

const CardModal = ({ isOpen, onClose, selectedArticle }) => {
    if (!isOpen) return null;


    return (
        <div className="modal_backdrop" onClick={onClose}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal_close-btn">
                    <img src={closeIcon} alt="Close" />
                </button>
                {selectedArticle && (
                    <figure className='Card_modal'>
                        <img src={selectedArticle.imgSrc} alt="sample87" />
                        <figcaption>
                            <h2>{selectedArticle.title}</h2>
                            <p>{selectedArticle.description}</p>
                            <a href="#" className="follow">제보하기</a>
                        </figcaption>
                    </figure>
                )}
            </div>
        </div>
    );
};

export default CardModal;
