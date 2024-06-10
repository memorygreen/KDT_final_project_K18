import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MissingKakaoMap from './MissingKakaoMap';
import SearchBar from './SearchBar';
import UploadMissingImg from './UploadMissingImg';
import { createPoster } from '../Poster/CreatePost';

import avatar from "./assets/avatar.png"
import { MissingAvatar } from './MissingAvatar';

import './SearchMissing.css';



const SearchMissing = ({ initialData }) => {
    console.log('SearchMissing 컴포넌트에서 초기값 있는지 확인 data:', initialData ? initialData.data : 'No initial data')
    const sessionId = sessionStorage.getItem('userId') // session에 있는 id 값 


    const [selectedTxt, setSelectTxt] = useState('');
    const [selectBox, setSelectBox] = useState('');



    

    const [selectedTop, setSelectedTop] = useState(initialData && initialData.data && initialData.data.MISSING_TOP ? initialData.data.MISSING_TOP : '');
    const [selectedTopColor, setSelectedTopColor] = useState(initialData && initialData.data && initialData.data.MISSING_TOP_COLOR ? initialData.data.MISSING_TOP_COLOR : '');

    const [selectedBottom, setSelectedBottom] = useState(initialData && initialData.data && initialData.data.MISSING_BOTTOMS ? initialData.data.MISSING_BOTTOMS : '');
    const [selectedBottomColor, setSelectedBottomColor] = useState(initialData && initialData.data && initialData.data.MISSING_BOTTOMS_COLOR ? initialData.data.MISSING_BOTTOMS_COLOR : '');
    const [selectedBelongings, setSelectedBelongings] = useState(initialData && initialData.data && initialData.data.BELONGINGS_CATE ? initialData.data.BELONGINGS_CATE : '');



    const [missingName, setMissingName] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_NAME : '');

    const [missingAge, setMissingAge] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_AGE : '');
    const [missingGender, setMissingGender] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_GENDER : '');
    const [missingLocation, setMissingLocation] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_LOCATION : '');
    const [missingLocationLat, setMissingLocationLat] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_LOCATION_LAT : '');
    const [missingLocationLng, setMissingLocationLng] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_LOCATION_LON : '');
    const [missingImgUrl, setMissingImgUrl] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_IMG : '');

    const [missingClothesEtc, setMissingClothesEtc] = useState(initialData && initialData.length > 0 ? initialData[0].MISSING_CLOTHES_ETC : '');
    const [missingBelongingsEtc, setMissingBelongingsEtc] = useState(initialData && initialData.length > 0 ? initialData[0].BELONGINGS_ETC : '');
    const [missingImg, setMissingImg] = useState([]);

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
        setMissingLocationLng(lng);

    };



    const topOptions = [
        { id: 'long_sleeve', label: '긴팔' },
        { id: 'short_sleeve', label: '반팔' },
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
        { id: 'hat', label: '모자' },
        { id: 'back_pack', label: '배낭' },
        { id: 'shoulder_bag', label: '숄더백' },
        { id: 'hand_bag', label: '핸드백' },
        { id: 'acc_none', label: '해당없음' },
    ];

    const genderOptions = [
        { id: 'male', label: '여성' },
        { id: 'female', label: '남성' }
    ];

    // 포스터 생성기능
    const [posterGenerating,setPosterGenerating] = useState('');
   

    

    

    const handle_submit = async (event) => {
        event.preventDefault();
       
        if (missingImg) {
            try {
                setMissingImgUrl(await UploadMissingImg(missingImg));
              
                // missingImgUrl = Url;
                console.log("업로드된 이미지 URL (확인)):", missingImgUrl); // URL을 로그로 출력
            } catch (error) {
                console.error('실종자 이미지 업로드 실패 Failed to upload image');
            }

            if (missingImgUrl) {
                // 백으로 보내기
                // POST request to submit form data
                axios.post('/SearchMissing', {                    
                    session_id : sessionId,

                    missing_name: missingName,
                    missing_gender: missingGender,
                    missing_age: missingAge,

                    missing_location: missingLocation,
                    missing_location_lat: missingLocationLat,
                    missing_location_lng: missingLocationLng,
                    missing_img: missingImgUrl,

                    selected_top: selectedTop,
                    selected_top_color: selectedTopColor,
                    selected_bottom: selectedBottom,
                    selected_bottom_color: selectedBottomColor,
                    selected_belongings: selectedBelongings,

                    selected_top_kor: selectedTopKor,
                    selected_top_color_kor: selectedTopColorKor,
                    selected_bottom_kor: selectedBottomKor,
                    selected_bottom_color_kor: selectedBottomColorKor,
                    selected_belongings_kor: selectedBelongingsKor,

                    missing_clothes_etc: missingClothesEtc,
                    missing_belongings_etc: missingBelongingsEtc,
                })
                    .then(response => {
                        console.log('Report submitted successfully:', response.data);
                        alert("등록 성공")
                    })
                    .catch(error => {
                        console.error('Error submitting report:', error);
                        alert("등록 실패")
                        // Handle error
                    });
            } else {
                console.error('실종자 이미지 url 업로드 실패 No image to upload');
            }
            if (!missingImgUrl) {
                console.error('실종자 이미지 url을 업로드해주세요.');
            }
            
        
  }
                if (posterGenerating) {
                    try {
                        setTimeout(async () => {
                             await createPoster(); // createPoster 함수 실행
                            }, 5000);  //db값 저장되고 실행하도록 시간텀을 줌
                        } catch (error) {
                    // createPoster 함수 실행 중 오류가 발생한 경우 처리
                        console.error('Error creating poster:', error);
                            }
                    }
    };
   
    // // 인적사항 확인
    // console.log('프론트에서 넘어오는지 확인')
    // console.log('Missing Name:', missingName);
    // console.log('Missing Age:', missingAge);
    // console.log('Missing Gender:', missingGender);
    // console.log('Missing Location:', missingLocation);
    // console.log('Missing Location Lat:', missingLocationLat);
    // console.log('Missing Location Lng:', missingLocationLng);
    // console.log('Selected Img Url:', missingImgUrl);

    // // 인상착의 확인
    // console.log('Selected Top:', selectedTop);
    // console.log('Selected Top Color:', selectedTopColor);
    // console.log('Selected Bottom:', selectedBottom);
    // console.log('Selected Bottom Color:', selectedBottomColor);
    // console.log('Selected Belongings:', selectedBelongings);

    // console.log('Selected Top(Kor):', selectedTopKor);
    // console.log('Selected Top Color(Kor):', selectedTopColorKor);
    // console.log('Selected Bottom(Kor):', selectedBottomKor);
    // console.log('Selected Bottom Color(Kor):', selectedBottomColorKor);
    // console.log('Selected Belongings(Kor):', selectedBelongingsKor);

    // console.log('missingClothesEtc(인상착의 특이사항):', missingClothesEtc);
    // console.log('missingBelongingsEtc(소지품 특이사항):', missingBelongingsEtc);


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

    const handleClothesEtcChange = (event) => {
        setMissingClothesEtc(event.target.value);
    };

    const handleBelongingsEtcChange = (event) => {
        setMissingBelongingsEtc(event.target.value);
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


    // 인적사항 구분
    const missing_info_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>실종자 이름</h2>
                    
                        <input
                            type="text"
                            className="input_etc"
                            aria-label="Sizing example input"
                            aria-describedby="missing_name"
                            value={missingName}
                            onChange={handleNameChange}
                            placeholder = "실종자 이름 입력"
                        />
                    
                </div>

                <div className="search_missing_cate_content">
                    <h2>나이</h2>
                        <input
                            type="number"
                            className="input_etc"
                            aria-label="Sizing example input"
                            aria-describedby="missing_age"
                            value={missingAge}
                            onChange={handleAgeChange}
                            placeholder = "실종자 나이 입력"
                        />
                </div>

                <div className="search_missing_cate_content">
                    <h2>성별</h2>
                    <div className='search_missing_cate_content_buttons'>
                    {genderOptions.map(option => (
                        <React.Fragment key={option.id}>
                            <input
                                type="radio"
                                className="radio_btn"
                                name="MISSING_GENDER"
                                id={option.id}
                                value={option.id}
                                autoComplete="off"
                                checked={missingGender === option.id}
                                onChange={handleGenderChange}
                            />
                            <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
                        </React.Fragment>
                    ))}
                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>마지막 발견장소</h2>
                    <MissingKakaoMap getLatLon={getLatLon} getMissingLocation={getMissingLocation} 
                    initialLat={initialData.length > 0 ? initialData[0].MISSING_LOCATION_LAT : null}
                    initialLng={initialData.length > 0 ? initialData[0].MISSING_LOCATION_LON : null}
                    />
                </div>

                <div className="search_missing_cate_content">
                    <h2>실종자 이미지 업로드</h2>
                    <div className="input_etc_file_wrap">
                        <label className="input_etc_file_label" htmlFor="missing_img">
                            <span className="file_name">업로드</span>
                        </label>
                        <input
                            type="text"
                            className="input_etc"
                            aria-label="Sizing example input"
                            aria-describedby="missing_img"
                            value={missingImg ? missingImg.name : '선택된 파일이 없습니다.'}
                            onChange={handleNameChange}
                            placeholder = {missingImg ? missingImg.name : '선택된 파일이 없습니다.'}
                            readOnly='true'
                        />
                        <input
                            type="file"
                            className="input_etc_file"
                            id="missing_img"
                            onChange={handleImgChange}
                        />
                    </div>
                    {/** 미리보기 */}
                    {missingImg && (
                        <div>
                            {/* <div className="uploaded-file-name">업로드된 파일: {missingImg.name}</div> */}
                            {missingImg instanceof File && (
                                <img src={URL.createObjectURL(missingImg)} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                            )}
                        </div>
                    )}
                </div>

                <div className="search_missing_cate_content">
                    <h2>포스터 생성 유무 체크</h2>

                    <div className='search_missing_cate_content_poster'>
                        <input
                            type="checkbox"
                            className='radio_btn_poster'
                            id ='poster_check_box'
                            aria-label="포스터 생성 유무"
                            checked={posterGenerating} // 이 상태는 useState를 사용하여 관리해야 합니다.
                            onChange={(event) => setPosterGenerating(event.target.checked)}
                        />
                        <label className="radio_btn_label_poster" htmlFor='poster_check_box' >포스터 생성</label>
                        
                        
                        <input
                            type="text"
                            className="input_etc_poster_notice"
                            aria-label="Sizing example input"
                            aria-describedby="missing_name"
                            value={posterGenerating ? '실종자인상착의 검색&실종자 찾기 포스터 생성':'실종자인상착의 검색만 실행'}
                            onChange={handleNameChange}
                            placeholder = {posterGenerating ? '실종자인상착의 검색&실종자 찾기 포스터 생성':'실종자인상착의 검색만 실행'}
                            readOnly='true'
                        />
                    </div>
                        
                    
                </div>
                



            </div>
        );
    };

    const missing_top_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>상의 구분</h2>
                    <div className='search_missing_cate_content_buttons'>
                            {topOptions.map(option => (
                                <React.Fragment key={option.id}>
                                    <input
                                        type="radio"
                                        className="radio_btn"
                                        name="MISSING_TOP"
                                        id={option.id}
                                        value={option.id}
                                        autoComplete="off"
                                        checked={selectedTop === option.id}
                                        onChange={handleTopChange}
                                    />
                                    <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
                                </React.Fragment>
                            ))}
                        
                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>상의 색상</h2>
                    <div className='search_missing_cate_content_buttons'>
                        {topColorOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="radio_btn"
                                    name="MISSING_TOP_COLOR"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedTopColor === option.id}
                                    onChange={handleTopColorChange}
                                />
                                <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
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
                    <div className='search_missing_cate_content_buttons'>

                        {bottomOptions.map(option => (
                            <React.Fragment key={option.id}>
                               
                                <input
                                    type="radio"
                                    className="radio_btn"
                                    name="MISSING_BOTTOMS"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBottom === option.id}
                                    onChange={handleBottomChange}
                                />
                                 <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}


                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>하의 색상</h2>
                    <div className='search_missing_cate_content_buttons'>
                        {bottomColorOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="radio_btn"
                                    name="MISSING_BOTTOMS_COLOR"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBottomColor === option.id}
                                    onChange={handleBottomColorChange}
                                />
                                <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>


                <div className="search_missing_cate_content">
                    <h2>인상착의 특이사항</h2>
                        <input
                            type="text"
                            className="input_etc"
                            aria-label="Sizing example input"
                            aria-describedby="missing_clothes_etc"
                            value={missingClothesEtc}
                            onChange={handleClothesEtcChange}
                            placeholder = "인상착의 특이사항 입력"
                        />
                </div>

            </div>
        );
    };

    const missing_belongings_box = () => {
        return (
            <div className="search_missing_cate_group">
                <div className="search_missing_cate_content">
                    <h2>소지품 선택</h2>
                    <div className='search_missing_cate_content_buttons'>
                        {belongingsOptions.map(option => (
                            <React.Fragment key={option.id}>
                                <input
                                    type="radio"
                                    className="radio_btn"
                                    name="BELONGINGS"
                                    id={option.id}
                                    value={option.id}
                                    autoComplete="off"
                                    checked={selectedBelongings === option.id}
                                    onChange={handleBelongingsChange}
                                />
                                <label className="radio_btn_label" htmlFor={option.id}>{option.label}</label>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="search_missing_cate_content">
                    <h2>소지품 특이사항</h2>
                    
                        <input
                            type="text"
                            className="input_etc"
                            aria-label="Sizing example input"
                            aria-describedby="missing_belongings_etc"
                            value={missingBelongingsEtc}
                            onChange={handleBelongingsEtcChange}
                            placeholder = "소지품 특이사항 입력"
                        />
                        
                    
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
    console.log('selectBox 값:', selectBox);
    


    return (
        <div>
            <div className='missing_avatar_all'>
                < MissingAvatar 
                selectedTop ={selectedTop}
                selectedTopColor= {selectedTopColor}
                selectedBottom = {selectedBottom}
                selectedBottomColor = {selectedBottomColor}
                selectedBelongings = {selectedBelongings}

                />
            </div>


            <div className='search_bar_all'>
                <SearchBar setSelectTxt={setSelectTxt} handleSubmit={handle_submit}/>
                {selectedComponent}
            </div>
        </div>
    );
};

export default SearchMissing;
