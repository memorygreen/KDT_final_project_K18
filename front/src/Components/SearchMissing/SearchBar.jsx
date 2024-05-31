import React from 'react'
import './SearchBar.css';
const SearchBar = ({setSelectTxt}) => {

    const btnContents = ['인적사항','상의', '하의', '소지품']
  return (
    <div className='searchBar'>
        {btnContents.map((item) => 
            <button className='search_bar_btn'  onClick={()=>{setSelectTxt({item})}}>{item}</button>
        )}
        
    </div>
  )
}

export default SearchBar