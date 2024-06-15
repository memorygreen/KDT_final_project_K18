import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MissingKakaoMap from './MissingKakaoMap';
import SearchBar from './SearchBar';
import UploadMissingImg from './UploadMissingImg';
import { createPoster } from '../Poster/CreatePost';
import { MissingAvatar } from './MissingAvatar';
import { useNavigate } from 'react-router-dom'; // useHistory 훅 추가

import './SearchMissing.css';

const SearchMissing = ({ initialData }) => {

    const navigate = useNavigate(); // 리다이렉트를 위한 navigate 함수 사용


    const sessionId = sessionStorage.getItem('userId') // session에 있는 id 값 

    const [selectedTxt, setSelectTxt] = useState('');
    const [selectBox, setSelectBox] = useState('');

    // console.log('SearchMissing 컴포넌트에서 초기값 있는지 확인 data:', initialData ? initialData : 'No initial data')


    // 인적사항 변수
    const [missingName, setMissingName] = useState('');
    const [missingAge, setMissingAge] = useState('');
    const [missingGender, setMissingGender] = useState('');
    const [missingLocation, setMissingLocation] = useState('');
    const [missingLocationLat, setMissingLocationLat] = useState('');
    const [missingLocationLng, setMissingLocationLng] = useState('');
    const [missingImgUrl, setMissingImgUrl] = useState('');

    // 인상착의 변수
    const [selectedTop, setSelectedTop] = useState('');
    const [selectedTopColor, setSelectedTopColor] = useState('');
    const [selectedBottom, setSelectedBottom] = useState('');
    const [selectedBottomColor, setSelectedBottomColor] = useState('');
    const [selectedBelongings, setSelectedBelongings] = useState('');

    const [missingClothesEtc, setMissingClothesEtc] = useState('');
    const [missingBelongingsEtc, setMissingBelongingsEtc] = useState('');
    // 실종자 이미지 
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
        { id: 'top long', label: '긴팔' }, //임시
        { id: 'top short', label: '반팔' }, // 임시
    ];

    const topColorOptions = [
        { id: 'top red', label: '빨간색' }, // 변경 완
        { id: 'top yellow', label: '노란색' }, // 변경 완
        { id: 'top green', label: '초록색' }, //변경 완
        { id: 'top blue', label: '파란색' }, //변경 완
        { id: 'top purple', label: '보라색' }, //변경 완 추가
        { id: 'top white', label: '흰색' }, // 변경완
        { id: 'top gray', label: '회색' }, // 변경완
        { id: 'top black', label: '검정색' }, //변경완
    ];

    const bottomOptions = [
        { id: 'bottom long', label: '긴바지' }, // 임시
        { id: 'bottom short', label: '반바지' }, // 임시
        { id: 'bottom skirt', label: '치마' }, // 변경완
    ];

    const bottomColorOptions = [
        { id: 'bottom yellow', label: '노란색' }, // 변경 완
        { id: 'bottom green', label: '초록색' }, // 변경완
        { id: 'bottom blue', label: '파란색' }, // 변경완
        { id: 'bottom purple', label: '보라색' }, // 변경완
        { id: 'bottom pink', label: '분홍색' }, // 변경완
        { id: 'bottom brown', label: '갈색' }, // 변경완
        { id: 'bottom white', label: '흰색' }, // 변경완
        { id: 'bottom gray', label: '회색' }, // 변경완
        { id: 'bottom black', label: '검정색' }, // 변경완
    ];

    const belongingsOptions = [
        { id: 'hat', label: '모자' }, // 변경완
        { id: 'backpack', label: '배낭' }, // 변경완
        { id: 'shoulder bag', label: '숄더백' }, // 변경완
        { id: 'hand bag', label: '핸드백' }, // 변경완
        { id: 'acc_none', label: '해당없음' },
    ];

    const genderOptions = [
        { id: 'female', label: '여성' },
        { id: 'male', label: '남성' }
    ];

    // 포스터 생성기능
    const [posterGenerating, setPosterGenerating] = useState('');

    const handle_submit = async (event) => {
        event.preventDefault();
        if (missingImg) {
            try {
                const uploadedImageUrl = await UploadMissingImg(missingImg); // 업로드 완료될때까지 기다리기
                setMissingImgUrl(uploadedImageUrl);
                console.log("업로드된 이미지 URL:", uploadedImageUrl);
                // missingImgUrl = Url;
                console.log("업로드된 이미지 URL (확인)):", missingImgUrl); // URL을 로그로 출력
            } catch (error) {
                console.error('실종자 이미지 aws 업로드 실패 Failed to upload image');
            }

            const prompt = `
            실종자를 찾는 포스터를 생성
            실종자 정보 : 동양인
            성별: ${missingGender}
            나이: ${missingAge}
            상의 타입: ${selectedTop}
            상의 색상: ${selectedTopColor}
            하의 타입: ${selectedBottom}
            하의 색상: ${selectedBottomColor}
            해당하는 이미지 생성해줘
            `;

            console.log(prompt);
            if (missingImgUrl) {
                // 백으로 보내기
                // POST request to submit form data
                console.log('post 들어왔는지 확인')
                axios.post('/SearchMissing', {
                    session_id: sessionId,

                    missing_name: missingName,
                    missing_gender: missingGender,
                    missing_age: missingAge,

                    missing_location: missingLocation,
                    missing_location_lat: missingLocationLat,
                    missing_location_lng: missingLocationLng,
                    missing_img_url: missingImgUrl,

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
                        console.log('실종자 정보 등록 성공 successfully:', response.data);
                        alert("등록 성공(포스터 생성 시 완료까지 시간이 소요됩니다)")
                        navigate('/'); // 성공 후 메인 페이지로 리다이렉트


                        // 포스터 생성
                        if (posterGenerating) {
                            try {
                                setTimeout(async () => {
                                    await createPoster(prompt); // createPoster 함수 실행
                                }, 5000);  //db값 저장되고 실행하도록 시간텀을 줌
                            } catch (error) {
                                // createPoster 함수 실행 중 오류가 발생한 경우 처리
                                console.error('Error creating poster:', error);
                            }
                        }

                        

                    })
                    .catch(error => {
                        console.error('실종자 정보 등록 실패 에러 Error submitting report:', error);
                        alert("등록 실패")
                        // Handle error
                    });
            } else {
                console.error('실종자 이미지 url 받은 후 백으로 보내기 실패 No image to upload');
                console.error('실종자 이미지 url을 업로드해주세요.');
            }


        }

        // 포스터 생성

    };


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
                        placeholder="실종자 이름 입력"
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
                        placeholder="실종자 나이 입력"
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
                    <MissingKakaoMap getLatLon={getLatLon} getMissingLocation={getMissingLocation} />
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
                            placeholder={missingImg ? missingImg.name : '선택된 파일이 없습니다.'}
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
                            id='poster_check_box'
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
                            value={posterGenerating ? '실종자인상착의 검색&실종자 찾기 포스터 생성' : '실종자인상착의 검색만 실행'}
                            onChange={handleNameChange}
                            placeholder={posterGenerating ? '실종자인상착의 검색&실종자 찾기 포스터 생성' : '실종자인상착의 검색만 실행'}
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
                        placeholder="인상착의 특이사항 입력"
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
                        placeholder="소지품 특이사항 입력"
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
    }


    return (
        <div className='SearchMissing_all'>
            <div className='search_bar_all'>
                <div className='search_missing_avatar_all'>
                    < MissingAvatar
                        selectedTop={selectedTop}
                        selectedTopColor={selectedTopColor}
                        selectedBottom={selectedBottom}
                        selectedBottomColor={selectedBottomColor}
                        selectedBelongings={selectedBelongings}
                    />
                    <div className='search_missing_info_all'>
                        <SearchBar setSelectTxt={setSelectTxt} handle_submit={handle_submit} />
                        {selectedComponent}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchMissing;
