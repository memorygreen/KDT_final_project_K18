import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import MissingKakaoMap from './MissingKakaoMap';
import SearchBar from './SearchBar';

const SearchMissing = () => {
    const [selectedTxt, setSelectTxt] = useState('');
    const [selectBox, setSelectBox] = useState('');


    // 인적사항 변수
    const [missingName, setMissingName] = useState(''); //실종자 이름
    const [missingAge, setMissingAge] = useState(''); // 실종자 나이
    const [missingGender, setMissingGender] = useState(''); // 실종자 성별
    const [missingLocation, setMissingLocation] = useState(''); //실종자 마지막 발견 장소
    const [missingLocationLat, setMissingLocationLat] = useState(''); //마지막 발견 장소 위도
    const [missingLocationLng, setMissingLocationKLng] = useState(''); //마지막 발견 장소 경도
    const [missingImg, setMissingImg] = useState(null); //실종자 얼굴 사진 경로


    // 인상착의 변수
    const [selectedTop, setSelectedTop] = useState('');
    const [selectedTopColor, setSelectedTopColor] = useState('');
    const [selectedBottom, setSelectedBottom] = useState('');
    const [selectedBottomColor, setSelectedBottomColor] = useState('');
    const [selectedBelongings, setSelectedBelongings] = useState('');

    // 인상착의의 라벨(한글)을 받기 위한 변수 설정
    const [selectedTopKor, setSelectedTopKor] = useState('');
    const [selectedTopColorKor, setSelectedTopColorKor] = useState('');
    const [selectedBottomKor, setSelectedBottomKor] = useState('');
    const [selectedBottomColorKor, setSelectedBottomColorKor] = useState('');
    const [selectedBelongingsKor, setSelectedBelongingsKor] = useState('');


    /** 자영(240603):주소 받아오는 함수 */
    const getMissingLocation = (address) => {
        console.log('정상적으로 넘어왔습니다. getMissingLocation(address)', address);
        setMissingLocation(address);

    };


    /** 위도, 경도를 받아오는 함수 */
    const getLatLon = (lat, lng) => {
        console.log('정상적으로 넘어왔습니다. getLatLon function', lat, lng);
        setMissingLocationLat(lat);
        setMissingLocationKLng(lng);

    };

    const topOptions = [
        { id: 'long_sleeve', label: '긴팔' },
        { id: 'short_sleeve', label: '반팔' },
        { id: 'sleeveless', label: '민소매' },
        { id: 'onepice', label: '원피스' },
    ];

    const topColorOptions = [
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

    const bottomOptions = [
        { id: 'long_pants', label: '긴바지' },
        { id: 'short_pants', label: '반바지' },
        { id: 'skirt', label: '치마' },
        { id: 'bottom_type_none', label: '해당없음' },
    ];

    const bottomColorOptions = [
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

    const belongingsOptions = [
        { id: 'carrier', label: '캐리어' },
        { id: 'umbrella', label: '우산' },
        { id: 'bag', label: '가방' },
        { id: 'hat', label: '모자' },
        { id: 'glasses', label: '안경' },
        { id: 'acc_none', label: '해당없음' },
    ];

    const genderOptions = [
        { id: 'male', label: '여성' },
        { id: 'female', label: '남성' }
    ];

    const handle_submit = async (event) => {
        event.preventDefault();
        // POST request to submit form data
        axios.post('/SearchMissing', {
            missing_name: missingName,
            missing_gender: missingGender,
            missing_age: missingAge,
            missing_location_lat: missingLocationLat,
            missing_location_lng: missingLocationLng,
            selected_top: selectedTop,
            selected_top_color: selectedTopColor,
            selected_bottom: selectedBottom,
            selected_bottom_color: selectedBottomColor,
            selected_belongings: selectedBelongings,
            missing_img: missingImg,
            selected_top_kor: selectedTopKor,
            selected_top_color_kor: selectedTopColorKor,
            selected_bottom_kor: selectedBottomKor,
            selected_bottom_color_kor: selectedBottomColorKor,
            selected_belongings_kor: selectedBelongingsKor,
        })
            .then(response => {
                console.log('Report submitted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error submitting report:', error);
                // Handle error
            });


        // 인적사항 확인
        console.log('Missing Name:', missingName);
        console.log('Missing Age:', missingAge);
        console.log('Missing Gender:', missingGender);
        console.log('Missing Location:', missingLocation);
        console.log('Missing Location Lat:', missingLocationLat);
        console.log('Missing Location Lng:', missingLocationLng);
        console.log('Selected Img:', missingImg);
        
        // 인상착의 확인
        console.log('Selected Top:', selectedTop);
        console.log('Selected Top Color:', selectedTopColor);
        console.log('Selected Bottom:', selectedBottom);
        console.log('Selected Bottom Color:', selectedBottomColor);
        console.log('Selected Belongings:', selectedBelongings);

        console.log('Selected Top(Kor):', selectedTopKor);
        console.log('Selected Top Color(Kor):', selectedTopColorKor);
        console.log('Selected Bottom(Kor):', selectedBottomKor);
        console.log('Selected Bottom Color(Kor):', selectedBottomColorKor);
        console.log('Selected Belongings(Kor):', selectedBelongingsKor);
    };


    // 인상착의 변경
    
    // 각 옵션의 label 값을 찾아서 상태에 저장하는 함수들
    const handleTopChange = (event) => {
        const selectedOption = topOptions.find(option => option.id === event.target.value);
        setSelectedTop(event.target.value);
        setSelectedTopKor(selectedOption ? selectedOption.label : '');
    };

    const handleTopColorChange = (event) => {
        const selectedOption = topColorOptions.find(option => option.id === event.target.value);
        setSelectedTopColor(event.target.value);
        setSelectedTopColorKor(selectedOption ? selectedOption.label : '');
    };

    const handleBottomChange = (event) => {
        const selectedOption = bottomOptions.find(option => option.id === event.target.value);
        setSelectedBottom(event.target.value);
        setSelectedBottomKor(selectedOption ? selectedOption.label : '');
    };

    const handleBottomColorChange = (event) => {
        const selectedOption = bottomColorOptions.find(option => option.id === event.target.value);
        setSelectedBottomColor(event.target.value);
        setSelectedBottomColorKor(selectedOption ? selectedOption.label : '');
    };

    const handleBelongingsChange = (event) => {
        const selectedOption = belongingsOptions.find(option => option.id === event.target.value);
        setSelectedBelongings(event.target.value);
        setSelectedBelongingsKor(selectedOption ? selectedOption.label : '');
    };


    // 인적사항 변경
    const handleNameChange = (event) => {
        setMissingName(event.target.value);
    };
    const handleAgeChange = (event) => {
        setMissingAge(event.target.value);
    };
    
    // const handleLocationChange = (event) => {
    //     setMissingLocation(event.target.value);
    // };
    const handleImgChange = (event) => {
        setMissingImg(event.target.files[0]);
    };
    const handleGenderChange = (event) => {
        setMissingGender(event.target.value);
    };

    useEffect(() => {
        setSelectBox(selectedTxt.item);
    }, [selectedTxt]);

    const missing_info_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>실종자 이름</h2>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="missing_name">실종자 이름</span>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="missing_name"
                            value={missingName}
                            onChange={handleNameChange}
                        />
                    </div>
                </div>


                <div className="search_missing_cate_content">
                    <h2>나이</h2>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="missing_age">나이</span>
                        <input
                            type="number"
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="missing_age"
                            value={missingAge}
                            onChange={handleAgeChange}
                        />
                    </div>
                </div>


                <div className="search_missing_cate_content">
                    <h2>성별</h2>
                    {genderOptions.map(option => (
                        <React.Fragment key={option.id}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="MISSING_GENDER"
                                id={option.id}
                                value={option.id}
                                autoComplete="off"
                                checked={missingGender === option.id}
                                onChange={handleGenderChange}
                            />
                            <label className="btn btn-outline-secondary" htmlFor={option.id}>{option.label}</label>
                        </React.Fragment>
                    ))}
                </div>

                {/* <div className="search_missing_cate_content">
                    <h2>마지막 발견 장소</h2>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="missing_location">마지막 발견 장소</span>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="missing_location"
                            value={missingLocation}
                            onChange={handleLocationChange}
                        />
                    </div>

                    
                </div> */}


                <div className="search_missing_cate_content">
                    <h2>마지막 발견장소</h2>
                    <MissingKakaoMap getLatLon={getLatLon} getMissingLocation={getMissingLocation} />
                </div>


                <div className="search_missing_cate_content">
                    <h2>실종자 이미지 업로드</h2>
                    <input
                        type="file"
                        className="form-control"
                        id="missing_img"
                        onChange={handleImgChange}
                    />
                    <label className="input-group-text" htmlFor="missing_img">업로드</label>
                </div>
            </div>
        );
    };

    const missing_top_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>상의 구분</h2>
                    <div>
                        <ul>
                            {topOptions.map(option => (
                                <React.Fragment key={option.id}>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="MISSING_TOP"
                                        id={option.id}
                                        value={option.id}
                                        autoComplete="off"
                                        checked={selectedTop === option.id}
                                        onChange={handleTopChange}
                                    />
                                    <label className="btn" htmlFor={option.id}>{option.label}</label>
                                </React.Fragment>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>상의 색상</h2>
                    <div>
                        {topColorOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="MISSING_TOP_COLOR"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedTopColor === option.id}
                                    onChange={handleTopColorChange}
                                />
                                <label className="btn" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const missing_bottoms_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>하의 구분</h2>
                    <div>

                        {bottomOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="MISSING_BOTTOMS"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBottom === option.id}
                                    onChange={handleBottomChange}
                                />
                                <label className="btn" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}


                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>하의 색상</h2>
                    <div>
                        {bottomColorOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="MISSING_BOTTOMS_COLOR"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBottomColor === option.id}
                                    onChange={handleBottomColorChange}
                                />
                                <label className="btn" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const missing_belongings_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>소지품 선택</h2>
                    <div>
                        {belongingsOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="BELONGINGS"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBelongings === option.id}
                                    onChange={handleBelongingsChange}
                                />
                                <label className="btn btn-outline-secondary" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    let selectedComponent;

    if (selectBox === '인적사항') {
        selectedComponent = missing_info_box();
    } else if (selectBox === '상의') {
        selectedComponent = missing_top_box();
    } else if (selectBox === '하의') {
        selectedComponent = missing_bottoms_box();
    } else if (selectBox === '소지품') {
        selectedComponent = missing_belongings_box();
    } else {
        selectedComponent = null;
    }

    return (
        <div>
            <SearchBar setSelectTxt={setSelectTxt} />

            <button className='search_missing_submit_btn' onClick={handle_submit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
            </button>

            <div>{selectedComponent}</div>
        </div>
    );
};

export default SearchMissing;
