import React, { useState } from 'react';
import { Map, useKakaoLoader, MapMarker, CustomOverlayMap, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';
import mapicons_red from './assets/mapicons_red.png';
import mapicons_blue from './assets/mapicons_blue.png';
import './KakaoMap.css';

const KakaoMap = () => {
    const [loading, error] = useKakaoLoader({
        appkey: process.env.REACT_APP_KAKAO_MAP_KEY,
    });


    // 관리자가 CCTV 위치를 입력하고 이름값 같은걸 넣어두고
    // db해당 테이블 데이터 불러와서 해당 값에 넣으면 될듯
    // useState([]) << []안에 들어가는 값은 초기값이라 보면됨
    // 아래 클릭으로 컬러를 변하게 해놨지만, CCTV에서 정보를 받아왔을때 
    // 어느 조건이 된다면 색을 변하게 할 수 도 있을듯
    const [markerImages, setMarkerImages] = useState([
        { lat: 35.09364793, lng: 126.9396615, src: mapicons_blue, isClicked: false },
        { lat: 35.09364793, lng: 126.9396615, src: mapicons_blue, isClicked: false },
        { lat: 35.16346184, lng: 126.9175568, src: mapicons_blue, isClicked: false },
        { lat: 35.16346184, lng: 126.9175568, src: mapicons_blue, isClicked: false },
        { lat: 35.15859007, lng: 126.9206962, src: mapicons_blue, isClicked: false },
        { lat: 35.15859007, lng: 126.9206962, src: mapicons_blue, isClicked: false },
        { lat: 35.15825751, lng: 126.9254135, src: mapicons_blue, isClicked: false },
        { lat: 35.15825751, lng: 126.9254135, src: mapicons_blue, isClicked: false },
        { lat: 35.15825751, lng: 126.9254135, src: mapicons_blue, isClicked: false },
        { lat: 35.15673731, lng: 126.9198877, src: mapicons_blue, isClicked: false },
        { lat: 35.15673731, lng: 126.9198877, src: mapicons_blue, isClicked: false },
        { lat: 35.15673731, lng: 126.9198877, src: mapicons_blue, isClicked: false },
        { lat: 35.1549617, lng: 126.9185549, src: mapicons_blue, isClicked: false },
        { lat: 35.1549617, lng: 126.9185549, src: mapicons_blue, isClicked: false },
        { lat: 35.1549617, lng: 126.9185549, src: mapicons_blue, isClicked: false },
        { lat: 35.1578174, lng: 126.9186138, src: mapicons_blue, isClicked: false },
        { lat: 35.1578174, lng: 126.9186138, src: mapicons_blue, isClicked: false },
        { lat: 35.15823168, lng: 126.926463, src: mapicons_blue, isClicked: false },
        { lat: 35.15823168, lng: 126.926463, src: mapicons_blue, isClicked: false },
        { lat: 35.16028041, lng: 126.924589, src: mapicons_blue, isClicked: false },
        { lat: 35.16028041, lng: 126.924589, src: mapicons_blue, isClicked: false },
        { lat: 35.16144623, lng: 126.9238688, src: mapicons_blue, isClicked: false },
        { lat: 35.16144623, lng: 126.9238688, src: mapicons_blue, isClicked: false },
        { lat: 35.15961058, lng: 126.9157643, src: mapicons_blue, isClicked: false },
        { lat: 35.15961058, lng: 126.9157643, src: mapicons_blue, isClicked: false },
        { lat: 35.15918482, lng: 126.9144574, src: mapicons_blue, isClicked: false },
        { lat: 35.15918482, lng: 126.9144574, src: mapicons_blue, isClicked: false },
        { lat: 35.1626632, lng: 126.9184585, src: mapicons_blue, isClicked: false },
        { lat: 35.1626632, lng: 126.9184585, src: mapicons_blue, isClicked: false },
        { lat: 35.16028637, lng: 126.9186224, src: mapicons_blue, isClicked: false },
        { lat: 35.16028637, lng: 126.9186224, src: mapicons_blue, isClicked: false },
        { lat: 35.16028637, lng: 126.9186224, src: mapicons_blue, isClicked: false },
        { lat: 35.153933, lng: 126.912495, src: mapicons_blue, isClicked: false },
        { lat: 35.153933, lng: 126.912495, src: mapicons_blue, isClicked: false },
        { lat: 35.15130153, lng: 126.9162061, src: mapicons_blue, isClicked: false },
        { lat: 35.14292065, lng: 126.9184926, src: mapicons_blue, isClicked: false },
        { lat: 35.14292065, lng: 126.9184926, src: mapicons_blue, isClicked: false },
        { lat: 35.14300855, lng: 126.9171609, src: mapicons_blue, isClicked: false },
        { lat: 35.14300855, lng: 126.9171609, src: mapicons_blue, isClicked: false },
        { lat: 35.143626, lng: 126.915961, src: mapicons_blue, isClicked: false },
        { lat: 35.143626, lng: 126.915961, src: mapicons_blue, isClicked: false },
        { lat: 35.14403703, lng: 126.9175368, src: mapicons_blue, isClicked: false },
        { lat: 35.14403703, lng: 126.9175368, src: mapicons_blue, isClicked: false },
        { lat: 35.14342833, lng: 126.9193621, src: mapicons_blue, isClicked: false },
        { lat: 35.14342833, lng: 126.9193621, src: mapicons_blue, isClicked: false },
        { lat: 35.086489, lng: 126.938832, src: mapicons_blue, isClicked: false },
        { lat: 35.086489, lng: 126.938832, src: mapicons_blue, isClicked: false },
        { lat: 35.09231998, lng: 126.9389233, src: mapicons_blue, isClicked: false },
        { lat: 35.15568355, lng: 126.913659, src: mapicons_blue, isClicked: false },
        { lat: 35.15568355, lng: 126.913659, src: mapicons_blue, isClicked: false },
        { lat: 35.1545898, lng: 126.9150506, src: mapicons_blue, isClicked: false },
        { lat: 35.1545898, lng: 126.9150506, src: mapicons_blue, isClicked: false },
        { lat: 35.1545898, lng: 126.9150506, src: mapicons_blue, isClicked: false },
        { lat: 35.148201, lng: 126.929933, src: mapicons_blue, isClicked: false },
        { lat: 35.148201, lng: 126.929933, src: mapicons_blue, isClicked: false },
        { lat: 35.14772433, lng: 126.9266935, src: mapicons_blue, isClicked: false },
        { lat: 35.14772433, lng: 126.9266935, src: mapicons_blue, isClicked: false },
        { lat: 35.14772433, lng: 126.9266935, src: mapicons_blue, isClicked: false },
        { lat: 35.152454, lng: 126.925124, src: mapicons_blue, isClicked: false },
        { lat: 35.152454, lng: 126.925124, src: mapicons_blue, isClicked: false },
        { lat: 35.15297243, lng: 126.9224111, src: mapicons_blue, isClicked: false },
        { lat: 35.15297243, lng: 126.9224111, src: mapicons_blue, isClicked: false },
        { lat: 35.15220676, lng: 126.9203445, src: mapicons_blue, isClicked: false },
        { lat: 35.15220676, lng: 126.9203445, src: mapicons_blue, isClicked: false },
        { lat: 35.15220676, lng: 126.9203445, src: mapicons_blue, isClicked: false },
        { lat: 35.15397879, lng: 126.9215223, src: mapicons_blue, isClicked: false },
        { lat: 35.15397879, lng: 126.9215223, src: mapicons_blue, isClicked: false },
        { lat: 35.14532439, lng: 126.9168031, src: mapicons_blue, isClicked: false },
        { lat: 35.14532439, lng: 126.9168031, src: mapicons_blue, isClicked: false },
        { lat: 35.14532439, lng: 126.9168031, src: mapicons_blue, isClicked: false },
        { lat: 35.144181, lng: 126.915653, src: mapicons_blue, isClicked: false },
        { lat: 35.144181, lng: 126.915653, src: mapicons_blue, isClicked: false },
        { lat: 35.144181, lng: 126.915653, src: mapicons_blue, isClicked: false },
        { lat: 35.15799388, lng: 126.9354459, src: mapicons_blue, isClicked: false },
        { lat: 35.15799388, lng: 126.9354459, src: mapicons_blue, isClicked: false },
        { lat: 35.158592, lng: 126.933108, src: mapicons_blue, isClicked: false },
        { lat: 35.158592, lng: 126.933108, src: mapicons_blue, isClicked: false },
        { lat: 35.158592, lng: 126.933108, src: mapicons_blue, isClicked: false },
        { lat: 35.155653, lng: 126.9235203, src: mapicons_blue, isClicked: false },
        { lat: 35.155653, lng: 126.9235203, src: mapicons_blue, isClicked: false },
        { lat: 35.15528879, lng: 126.9356526, src: mapicons_blue, isClicked: false },
        { lat: 35.15528879, lng: 126.9356526, src: mapicons_blue, isClicked: false },
        { lat: 35.154684, lng: 126.936068, src: mapicons_blue, isClicked: false },
        { lat: 35.154684, lng: 126.936068, src: mapicons_blue, isClicked: false },
        { lat: 35.15745766, lng: 126.9337081, src: mapicons_blue, isClicked: false },
        { lat: 35.15745766, lng: 126.9337081, src: mapicons_blue, isClicked: false },
        { lat: 35.15956099, lng: 126.9291762, src: mapicons_blue, isClicked: false },
        { lat: 35.15956099, lng: 126.9291762, src: mapicons_blue, isClicked: false },
        { lat: 35.15785762, lng: 126.929376, src: mapicons_blue, isClicked: false },
        { lat: 35.15785762, lng: 126.929376, src: mapicons_blue, isClicked: false },
        { lat: 35.15402445, lng: 126.9293541, src: mapicons_blue, isClicked: false },
        { lat: 35.15402445, lng: 126.9293541, src: mapicons_blue, isClicked: false },
        { lat: 35.15970593, lng: 126.9369658, src: mapicons_blue, isClicked: false },
        { lat: 35.15970593, lng: 126.9369658, src: mapicons_blue, isClicked: false },
        { lat: 35.14514347, lng: 126.9243359, src: mapicons_blue, isClicked: false },
        { lat: 35.14514347, lng: 126.9243359, src: mapicons_blue, isClicked: false },
        { lat: 35.14387178, lng: 126.9241722, src: mapicons_blue, isClicked: false },
        { lat: 35.14387178, lng: 126.9241722, src: mapicons_blue, isClicked: false },
        { lat: 35.14310294, lng: 126.9236637, src: mapicons_blue, isClicked: false },
        { lat: 35.14310294, lng: 126.9236637, src: mapicons_blue, isClicked: false },
        { lat: 35.14535486, lng: 126.9261238, src: mapicons_blue, isClicked: false },
        { lat: 35.088973, lng: 126.948265, src: mapicons_blue, isClicked: false },
        { lat: 35.088973, lng: 126.948265, src: mapicons_blue, isClicked: false },
        { lat: 35.0985146, lng: 126.9379288, src: mapicons_blue, isClicked: false },
        { lat: 35.0985146, lng: 126.9379288, src: mapicons_blue, isClicked: false },
        { lat: 35.0985146, lng: 126.9379288, src: mapicons_blue, isClicked: false },
        { lat: 35.12498297, lng: 126.9364689, src: mapicons_blue, isClicked: false },
        { lat: 35.12498297, lng: 126.9364689, src: mapicons_blue, isClicked: false },
        { lat: 35.12669167, lng: 126.9346879, src: mapicons_blue, isClicked: false },
        { lat: 35.12669167, lng: 126.9346879, src: mapicons_blue, isClicked: false },
        { lat: 35.12669167, lng: 126.9346879, src: mapicons_blue, isClicked: false },
        { lat: 35.12700039, lng: 126.933032, src: mapicons_blue, isClicked: false },
        { lat: 35.12700039, lng: 126.933032, src: mapicons_blue, isClicked: false },
        { lat: 35.12340545, lng: 126.932777, src: mapicons_blue, isClicked: false },
        { lat: 35.12340545, lng: 126.932777, src: mapicons_blue, isClicked: false },
        { lat: 35.12340545, lng: 126.932777, src: mapicons_blue, isClicked: false },
        { lat: 35.12169171, lng: 126.9343615, src: mapicons_blue, isClicked: false }
    ]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleMarkerClick = (marker) => {
        setMarkerImages(
            markerImages.map((m) =>
                m.lat === marker.lat && m.lng === marker.lng
                    ? { ...m, isClicked: !m.isClicked }
                    : m
            )
        );
        setSelectedMarker(marker);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Map
            className='KakaoMap'
            center={{ lat: 35.14978, lng: 126.9199 }}
            level={5}
        >
            <MapTypeControl position={"TOPRIGHT"} />
            <ZoomControl position={"RIGHT"} />
            {markerImages.map((marker, index) => (
                <MapMarker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    image={{
                        src: marker.isClicked ? mapicons_red : mapicons_blue,
                        size: { width: 40, height: 40 },
                        options: { offset: { x: 15, y: 40 } },
                    }}
                    onClick={() => handleMarkerClick(marker)}
                />
            ))}

            {selectedMarker && (
                <CustomOverlayMap position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}>
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
                                        {`위도: ${selectedMarker.lat}, 경도: ${selectedMarker.lng}`}
                                  
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