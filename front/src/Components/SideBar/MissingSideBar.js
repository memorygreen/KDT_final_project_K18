import React, { useState } from 'react';
import './MissingSideBar.css';

const MissingSidebar = ({ missingList, setMissingIdx }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleItemClick = (idx) => {
    setMissingIdx(idx);
    setSelectedIdx(idx);
  };

  return (
    <div className='missing-sidebar'>
      <div className='missing-sidebar-title'>실종자 목록</div>
      {missingList.map((missing) => (
        <div key={missing.MISSING_IDX} 
             className={`missing-sidebar-item ${selectedIdx === missing.MISSING_IDX ? 'active' : ''}`} 
             onClick={() => handleItemClick(missing.MISSING_IDX)}>
          {missing.MISSING_NAME}
        </div>
      ))}
    </div>
  );
};

export default MissingSidebar;