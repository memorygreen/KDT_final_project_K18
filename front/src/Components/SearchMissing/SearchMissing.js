import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchMissing.css';

const SearchMissing = () => {
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

    const toggle_categories = (category) => {
        set_show_categories(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

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

    const handle_submit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('missing_name', missing_name);
        formData.append('missing_location', missing_location);
        formData.append('missing_img', missing_img);
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
    };

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

    return (
        <div className="search_missing">
            <form onSubmit={handle_submit}>
                <ul className="search_missing_sections">
                    <li>
                        <h3 onClick={() => toggle_categories('personal_info')} className="search_missing_cate_group_name">인적사항</h3>
                        <div className="search_missing_cate_group">
                            
                            {show_categories.personal_info && (
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
                            )}
                        </div>
                    </li>

                    <li>
                        <h3 onClick={() => toggle_categories('top')} className="search_missing_cate_group_name">상의</h3>
                        <div className="search_missing_cate_group">
                           
                            {show_categories.top && (
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
                            )}
                            {show_categories.top && (
                                <div className="search_missing_cate_content">
                                    <h2>상색선</h2>
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
                            )}
                        </div>
                    </li>

                    <li>
                        <h3 onClick={() => toggle_categories('bottoms')} className="search_missing_cate_group_name">하의</h3>
                        <div className="search_missing_cate_group">
                            
                            {show_categories.bottoms && (
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
                            )}
                            {show_categories.bottoms && (
                                <div className="search_missing_cate_content">
                                    <h2>하색선</h2>
                                    <div>
                                        {bottom_color_options.map(option => (
                                            <React.Fragment key={option.id}>
                                                <input
                                                    type="radio"
                                                    className="btn-check"
                                                    name="MISSING_BOTTOMS_COLOR"
                                                    id={option.id}
                                                    value={option.id}
                                                    autoComplete="off"
                                                    onChange={handle_bottom_color_change}
                                                />
                                                <label className="btn" htmlFor={option.id}>{option.label}</label>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>

                    <li>
                        <h3 onClick={() => toggle_categories('belongings')} className="search_missing_cate_group_name">소지품</h3>
                        <div className="search_missing_cate_group">
                            
                            {show_categories.belongings && (
                                <div className="search_missing_cate_content">
                                    <h2>소지품 선택</h2>
                                    <span>(중복선택 가능)</span>
                                    <div>
                                        {belongings_options.map(option => (
                                            <React.Fragment key={option.id}>
                                                <input
                                                    type="checkbox"
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
                            )}
                        </div>
                    </li>
                </ul>

                <button type='submit' className="btn btn-primary">검색</button>
            </form>
        </div>
    );
};

export default SearchMissing;
