import React from 'react';

const ViewMissingModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={
            {
                position: 'relative',
                top: 0, left: 0, right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }>
            <div style={{ background: 'white', padding: 20 }}>
                <button onClick={onClose}>닫기</button>
                {children}
            </div>
        </div>
    );
};

export default ViewMissingModal;