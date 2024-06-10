import React from 'react'
import './SearchBar.css';
const SearchBar = ({ setSelectTxt , handle_submit}) => {

  const btnContents = ['인적사항', '상의', '하의', '소지품']

  return (

    <div className='searchBar'>
      {btnContents.map((item, index) =>
      <React.Fragment key={item}>
        <input
          type="radio"
          name="category"
          id={item}
          value={item}
          className='search_bar_cate_radio'
          onChange={() => setSelectTxt({ item: item })} // 객체로 전달
        />
        <label key={index} className='search_bar_cate_label' htmlFor={item}>
        {item}
        </label>
      </React.Fragment>
    )}
        
    
      <button className='search_missing_submit_btn' onClick={handle_submit}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
      </button>
    </div>
    

  )
}

export default SearchBar