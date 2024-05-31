import React, { useState, useEffect } from 'react';
import { Map, useKakaoLoader, MapMarker, CustomOverlayMap, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import mapicons_red from './assets/mapicons_red.png';
import mapicons_blue from './assets/mapicons_blue.png';
import './KakaoMap.css';
import axios from 'axios';

const KakaoMap = () => {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
    });

    const [cctvData, setCctvData] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        // CCTV 데이터를 가져오는 함수
        const fetchCctvData = async () => {
            try {
                const response = await axios.get('/CCTVLocation');
                setCctvData(response.data);
            } catch (error) {
                console.error('Error fetching CCTV data:', error);
            }
        };

        // CCTV 데이터 가져오기
        fetchCctvData();
    }, []);

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
            {cctvData.map((marker, index) => (
                <MapMarker
                    key={index}
                    position={{ lat: marker.CCTV_LAT, lng: marker.CCTV_LNG }}
                    image={{
                        src: selectedMarker === marker ? mapicons_red : mapicons_blue,
                        size: { width: 40, height: 40 },
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
                                    <div>
                                        <a
                                            href="https://www.kakaocorp.com/main"
                                            target="_blank"
                                            className="link"
                                            rel="noreferrer"
                                        >
                                            홈페이지
                                        </a>
                                    </div>
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
