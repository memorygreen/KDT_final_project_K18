import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


//자영(240529): 검색 컴포넌트


const SearchMissing = () => {
    const [selectedTxt, setSelectTxt] = useState('');

    const [selectBox, setSelectBox] = useState('');

    //기존 코드에서 가져오기 
    const [selected_top, set_selected_top] = useState('');
    const [selected_top_color, set_selected_top_color] = useState('');
    const [selected_bottom, set_selected_bottom] = useState('');
    const [selected_bottom_color, set_selected_bottom_color] = useState('');
    const [selected_belongings, set_selected_belongings] = useState([]);

    const [missing_name, set_missing_name] = useState('');
    const [missing_location, set_missing_location] = useState('');
    const [missing_img, set_missing_img] = useState(null);
    const [image_url, set_image_url] = useState('');

    const [show_categories, set_show_categories] = useState({
        top: false,
        top_color: false,
        bottoms: false,
        bottoms_color: false,
        belongings: false,
        personal_info: false,  // Adding personal info toggle
    });
    // 기존 변수들 끝!


    // 각 항목별 변수들

    const top_options = [
        { id: 'long_sleeve', label: '긴팔' },
        { id: 'short_sleeve', label: '반팔' },
        { id: 'sleeveless', label: '민소매' },
        { id: 'onepice', label: '원피스' },
    ];

    const top_color_options = [
        { id: 'top_red', label: '빨간색' },
        { id: 'top_orange', label: '주황색' },
        { id: 'top_yellow', label: '노란색' },
        { id: 'top_green', label: '초록색' },
        { id: 'top_blue', label: '파란색' },
        { id: 'top_brown', label: '갈색' },
        { id: 'top_white', label: '흰색' },
        { id: 'top_grey', label: '회색' },
        { id: 'top_black', label: '검정색' },
    ];

    const bottom_options = [
        { id: 'long_pants', label: '긴바지' },
        { id: 'short_pants', label: '반바지' },
        { id: 'skirt', label: '치마' },
        { id: 'bottom_type_none', label: '해당없음' },
    ];

    const bottom_color_options = [
        { id: 'bottom_red', label: '빨간색' },
        { id: 'bottom_orange', label: '주황색' },
        { id: 'bottom_yellow', label: '노란색' },
        { id: 'bottom_green', label: '초록색' },
        { id: 'bottom_blue', label: '파란색' },
        { id: 'bottom_purple', label: '보라색' },
        { id: 'bottom_pink', label: '분홍색' },
        { id: 'bottom_brown', label: '갈색' },
        { id: 'bottom_white', label: '흰색' },
        { id: 'bottom_grey', label: '회색' },
        { id: 'bottom_black', label: '검정색' },
    ];

    const belongings_options = [
        { id: 'carrier', label: '캐리어' },
        { id: 'umbrella', label: '우산' },
        { id: 'bag', label: '가방' },
        { id: 'hat', label: '모자' },
        { id: 'glasses', label: '안경' },
        { id: 'acc_none', label: '해당없음' },
    ];
    // 각 항목별 변수들 끝!





    // 기존 것 핸들 어쩌고
    const handle_submit = async (event) => {
        // event.preventDefault();
        const formData = new FormData();
        formData.append('missing_name', missing_name);
        formData.append('missing_location', missing_location);
        formData.append('missing_img', missing_img); //다 돌리고 난 url만 넣어야함!!!
        formData.append('selected_top', selected_top);
        formData.append('selected_top_color', selected_top_color);
        formData.append('selected_bottom', selected_bottom);
        formData.append('selected_bottom_color', selected_bottom_color);
        selected_belongings.forEach((belonging, index) => {
            formData.append(`belongings[${index}]`, belonging);
        });

        try {
            const response = await axios.post("http://localhost:5000/serchMissing", formData);
            console.log(response.data);
            set_image_url(response.data);
        } catch (error) {
            console.error("Error generating image:", error);
        }
        console.log('Form submitted');

        //새로 추가
        console.log('Missing Name:', missing_name);
        console.log('Missing Location:', missing_location);
        console.log('Selected Top:', selected_top);
        console.log('Selected Top Color:', selected_top_color);
        console.log('Selected Bottom:', selected_bottom);
        console.log('Selected Bottom Color:', selected_bottom_color);
        console.log('Selected Belongings:', selected_belongings);
        console.log('Selected Img:', missing_img);


    };

    // 기존것 핸들 어쩌고 끝!
    const handle_top_change = (event) => {
        set_selected_top(event.target.value);
    };
    const handle_top_color_change = (event) => {
        set_selected_top_color(event.target.value);
    };
    const handle_bottom_change = (event) => {
        set_selected_bottom(event.target.value);
    };
    const handle_bottom_color_change = (event) => {
        set_selected_bottom_color(event.target.value);
    };
    const handle_belongings_change = (event) => {
        const value = event.target.value;
        set_selected_belongings(prevState =>
            prevState.includes(value)
                ? prevState.filter(item => item !== value)
                : [...prevState, value]
        );
    };
    const handle_name_change = (event) => {
        set_missing_name(event.target.value);
    };
    const handle_location_change = (event) => {
        set_missing_location(event.target.value);
    };
    const handle_img_change = (event) => {
        set_missing_img(event.target.files[0]);
    };


    //새로운 것들
    useEffect(() => {
        setSelectBox(selectedTxt.item);
    }, [selectedTxt]);

    const missing_info_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="missing_location">마지막 발견 장소</span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="missing_location"
                                value={missing_location}
                                onChange={handle_location_change}
                            />
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="missing_name"
                                placeholder="홍길동"
                                value={missing_name}
                                onChange={handle_name_change}
                            />
                            <label htmlFor="missing_name">실종자 이름</label>
                        </div>
                        <div className="input-group mb-3">
                            <input
                                type="file"
                                className="form-control"
                                id="missing_img"
                                onChange={handle_img_change}
                            />
                            <label className="input-group-text" htmlFor="missing_img">업로드</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const missing_top_box = () => {
        return (<div className="search_missing_cate_group">


            <div className="search_missing_cate_content">
                <h2>상의 구분</h2>
                <div>
                    <ul>
                        {top_options.map(option => (
                            <li key={option.id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="MISSING_TOP"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    onChange={handle_top_change}
                                />
                                <label className="btn" htmlFor={option.id}>{option.label}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="search_missing_cate_content">
                <h2>상의 색상</h2>
                <div>
                    {top_color_options.map(option => (
                        <React.Fragment key={option.id}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="MISSING_TOP_COLOR"
                                id={option.id}
                                value={option.id}
                                autoComplete="off"
                                onChange={handle_top_color_change}
                            />
                            <label className="btn" htmlFor={option.id}>{option.label}</label>
                        </React.Fragment>
                    ))}
                </div>
            </div>

        </div>);
    };



    const missing_bottoms_box = () => {
        return (
            <div className="search_missing_cate_group">
                    <div className="search_missing_cate_content">
                        <h2>하의 구분</h2>
                        <div>
                            {bottom_options.map(option => (
                                <li>
                                    <React.Fragment key={option.id}>
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="MISSING_BOTTOMS"
                                            id={option.id}
                                            value={option.id}
                                            autoComplete="off"
                                            onChange={handle_bottom_change}
                                        />
                                        <label className="btn" htmlFor={option.id}>{option.label}</label>
                                    </React.Fragment>
                                </li>
                            ))}

                        </div>
                    </div>
                
                    <div className="search_missing_cate_content">
                        <h2>하의 색상</h2>
                        <div>
                            {bottom_color_options.map(option => (
                                <React.Fragment key={option.id}>
                                    <input
                                        type="radio"
                                        className="search_missing_radio_btn"
                                        name="MISSING_BOTTOMS_COLOR"
                                        id={option.id}
                                        value={option.id}
                                        autoComplete="off"
                                        onChange={handle_bottom_color_change}
                                    />
                                    <label className="search_missing_radio_btn_name" htmlFor={option.id}>{option.label}</label>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                
            </div>
        )
    }
    
    // 소지품 항목 보여주는 함수
    const missing_belongings_box = () => {
        return (
            <div className="search_missing_cate_group">
                            
                            
                                <div className="search_missing_cate_content">
                                    <h2>소지품 선택</h2>
                
                                    <div>
                                        {belongings_options.map(option => (
                                            <React.Fragment key={option.id}>
                                                <input
                                                    type="radio"
                                                    className="btn-check"
                                                    name="BELONGINGS"
                                                    id={option.id}
                                                    value={option.id}
                                                    autoComplete="off"
                                                    onChange={handle_belongings_change}
                                                />



                                                <label className="btn btn-outline-secondary" htmlFor={option.id}>{option.label}</label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            
                        </div>
        );
    }


    let selectedComponent; // 항목을 선택했을 때 보여줄 div 태그 

    if (selectBox === '인상착의') {
        selectedComponent = missing_info_box();
    } else if (selectBox === '상의') {
        selectedComponent = missing_top_box();
    } else if (selectBox === '하의') {
        selectedComponent = missing_bottoms_box();
    }else if (selectBox === '소지품') {
        selectedComponent = missing_belongings_box();
    } else {
        selectedComponent = null;
    }

    return (
        <div>
            <SearchBar setSelectTxt={setSelectTxt} />

            <button className='search_missing_submit_btn' onClick={handle_submit}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg></button>

            <div>{selectedComponent}</div>

        </div>
    );
};

export default SearchMissing;
