import React, { useState, useEffect } from 'react';
import { Map, useKakaoLoader, MapMarker, CustomOverlayMap, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import mapicons_red from './assets/mapicons_red.png';
import mapicons_blue from './assets/mapicons_blue.png';
import './KakaoMap.css';
import axios from 'axios';

const KakaoMap = ({ missingIdx }) => {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
    });

    const [cctvData, setCctvData] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [userCaptures, setUserCaptures] = useState([]);

    useEffect(() => {
        // CCTV 데이터를 가져오는 함수
        const fetchCctvData = async () => {
            try {
                const response = await axios.get('/CCTVLocation');
                setCctvData(response.data);
                fetchUserCaptures();
            } catch (error) {
                console.error('Error fetching CCTV data:', error);
            }
        };
        // CCTV 데이터 가져오기
        fetchCctvData();
    }, []);


    // 사용자 전체 캡처 데이터를 가져오는 함수
    const fetchUserCaptures = async () => {
        try {
            const response = await axios.post('/get_user_captures', {
                user_id: sessionStorage.getItem('userId')
            });
            setUserCaptures(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user captures:', error);
        }
    };

    useEffect(() => {
        fetchUserCapture();
    }, [missingIdx]);


    // 1명의 캡쳐 데이터 가져오기
    const fetchUserCapture = async () => {
        try {
            const response = await axios.post('/get_captures_by_missing', {
                MISSING_IDX: missingIdx
            });
            setUserCaptures(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user captures:', error);
        }
    };

    const handleMarkerClick = (marker) => {
        // 현재 선택된 마커가 클릭된 마커와 같은지 확인하여 상태를 변경
        setSelectedMarker(prevMarker => (prevMarker === marker ? null : marker));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Map
            className='KakaoMap'
            center={{ lat: 35.14978, lng: 126.9199 }}
            level={3}
        >
            <MapTypeControl position={"TOPRIGHT"} />
            <ZoomControl position={"RIGHT"} />
            {cctvData.map((marker) => (
                <MapMarker
                    key={marker.CCTV_IDX}
                    position={{ lat: marker.CCTV_LAT, lng: marker.CCTV_LNG }}
                    image={{
                        src: userCaptures.some(capture => capture.CCTV_IDX === marker.CCTV_IDX) ? mapicons_red : mapicons_blue,
                        size: { width: 30, height: 30 },
                        options: { offset: { x: 15, y: 40 } },
                    }}
                    onClick={() => handleMarkerClick(marker)}
                />
            ))}

            {selectedMarker && (
                <CustomOverlayMap position={{ lat: selectedMarker.CCTV_LAT, lng: selectedMarker.CCTV_LNG }}>
                    <div className="overlay">
                        <div className="info">
                            <div className="title">
                                위치 정보
                                <div
                                    className="close"
                                    onClick={() => setSelectedMarker(null)}
                                    title="닫기"
                                    style={{ cursor: 'pointer' }}
                                >
                                    닫기
                                </div>
                            </div>
                            <div className="body">
                                <div className="desc">
                                    <div className="ellipsis">

                                        {`위치 : ${selectedMarker.CCTV_LOAD_ADDRESS}`}
                                        <br />
                                        {`위도: ${selectedMarker.CCTV_LAT}, 경도: ${selectedMarker.CCTV_LNG}`}
                                    </div>
                                    <div className='Captrue_Map'>
                                        {userCaptures.find(capture => capture.CCTV_IDX === selectedMarker.CCTV_IDX) &&
                                            <img src={userCaptures.find(capture => capture.CCTV_IDX === selectedMarker.CCTV_IDX).CAPTURE_PATH} alt="캡처 이미지" />
                                        }
                                    </div>
                                    {/* 세션 스토리지에 userCate 값이 INDI 가 아니면 상세보기 링크 표시 */}
                                    {sessionStorage.getItem('userCate') !== 'INDI' && (
                                        <div>
                                            <a
                                                href={`/ViewCCTVPage/${selectedMarker.CCTV_IDX}`}
                                                className="link"
                                                rel="noreferrer"
                                            >
                                                CCTV 상세보기
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomOverlayMap>
            )}
        </Map>
    );
};

export default KakaoMap;
