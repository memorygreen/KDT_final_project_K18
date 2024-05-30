import React from 'react'
import './SearchBar.css';



// 자영(240529) : 검색바(고정) 컴포넌트)
const SearchBar = ({setSelectTxt}) => {

    const btnContents = ['인상착의','상의', '하의', '소지품']
  return (
    <div className='searchBar'>
        {btnContents.map((item) => 
            <button className='search_bar_btn'  onClick={()=>{setSelectTxt({item})}}>{item}</button>
        )}
        
    </div>
  )
}

export default SearchBar