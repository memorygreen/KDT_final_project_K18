import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchMissing.css';

const SearchMissing = () => {
    const [selected_top, set_selected_top] = useState(['long_sleeve', 'short_sleeve', 'sleeveless', 'onepice']);
    const [selectedFruit, setSelectedFruit] = useState(null);



    const [showCategories, setShowCategories] = useState({
        top: false,
        top_color: false,
        bottoms: false,
        bottoms_color: false
    });

    const toggleCategories = (category) => {
        setShowCategories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };


    const handleChange = (event) => {
        set_selected_top(event.target.value);
    };


    return (
        <div className="search_missing">
            <div>

                <div class="search_missing_cate_content">
                    <h2 onClick={() => toggleCategories('top')}>상의 선택</h2>
                    {showCategories.top && (
                        <div>
                            <form>
                                <input type="radio" class="btn-check" name="MISSING_TOP" id="long_sleeve" autocomplete="off" onChange={handleChange} />
                                <label class="btn" for="long_sleeve">긴팔</label>

                                <input type="radio" class="btn-check" name="MISSING_TOP" id="short_sleeve" autocomplete="off" onChange={handleChange} />
                                <label class="btn" for="short_sleeve">반팔</label>

                                <input type="radio" class="btn-check" name="MISSING_TOP" id="sleeveless" autocomplete="off" onChange={handleChange} />
                                <label class="btn" for="sleeveless">민소매</label>

                                <input type="radio" class="btn-check" name="MISSING_TOP" id="onepice" autocomplete="off" onChange={handleChange} />
                                <label class="btn" for="onepice">원피스</label>
                            </form>
                        </div>


                    )}


                </div>
            </div>
            <div class="search_missing_cate_content" >
                <h2 onClick={() => toggleCategories('top')}>상의 색상 선택</h2>
                {showCategories.top && (
                    <div>
                        <form>
                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_red" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_red">빨간색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_orange" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_orange">주황색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_yellow" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_yellow">노란색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_green" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_green">초록색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_blue" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_blue">파란색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_brown" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_brown">갈색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_white" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_white">흰색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_grey" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_grey">회색</label>

                            <input type="radio" class="btn-check" name="MISSING_TOP_COLOR" id="top_balck" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="top_balck">검정색</label>


                        </form>
                    </div>

                )}
            </div>
            <div>
            <div class="search_missing_cate_content">
                <h2 onClick={() => toggleCategories('bottoms')}>하의 선택</h2>
                {showCategories.bottoms && (
                    <div>
                        <form>
                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS" id="long_pants" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="long_pants">긴바지</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS" id="short_pants" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="short_pants">반바지</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS" id="skirt" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="skirt">치마</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS" id="bottom_type_none" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_type_none">해당없음</label>
                        </form>
                    </div>
                )}
            </div>

            
            <div class="search_missing_cate_content">
                <h2 onClick={() => toggleCategories('bottoms')}>하의 색상 선택</h2>
                {showCategories.bottoms && (
                    <div>
                        <form>
                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_red" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_red">빨간색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_orange" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_orange">주황색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_yellow" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_yellow">노란색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_green" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_green">초록색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_blue" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_blue">파란색</label>
                          

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_purple" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_purple">보라색</label>


                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_pink" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_pink">분홍색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_brown" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_brown">갈색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_white" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_white">흰색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_grey" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_grey">회색</label>

                            <input type="radio" class="btn-check" name="MISSING_BOTTOMS_COLOR" id="bottom_black" autocomplete="off" onChange={handleChange} />
                            <label class="btn" for="bottom_black">검정색</label>

                        </form>
                    </div>
                )}
            </div>

            </div>
        </div>
    );
};

export default SearchMissing;
