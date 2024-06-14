import React from 'react';
import './MissingSideBar.css';

const MissingSidebar = ({ missingList, setMissingIdx }) => {
  return (
    <div className='missing-sidebar'>
      <div className='missing-sidebar-title'>실종자 목록</div>
      {missingList.map((missing) => (
        <div key={missing.MISSING_IDX} className='missing-sidebar-item' onClick={() => setMissingIdx(missing.MISSING_IDX)}>
          {missing.MISSING_NAME}
        </div>
      ))}
    </div>
  );
};

export default MissingSidebar;