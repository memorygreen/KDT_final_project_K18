import React, { useEffect, useState, useRef } from 'react';


// 자영(240531): 실종자 마지막 발견장소-> 카카오맵 위 클릭 시 마커 찍힘 + 
// useDidMountEffect 훅을 정의합니다. 이 훅은 첫 번째 렌더링을 제외하고 실행됩니다.
function useDidMountEffect(func, deps) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
}


export default function MissingKakaoMap({getLatLon}) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState(''); // 주소를 저장할 상태

  // lng, lat 위도 경도 전역변수 설정
  var lng = 0
  var lat = 0
  

  // 1) 카카오맵 및 우편번호 서비스 스크립트 로드
  useEffect(() => {
    const loadKakaoMaps = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=5ac7859e164cfb32a5714abe745c5445&libraries=services";
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    const loadPostcode = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    // 카카오맵과 우편번호 스크립트를 로드한 후 맵을 초기화합니다.
    loadKakaoMaps().then(() => {
      loadPostcode().then(() => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
              center: new window.kakao.maps.LatLng(35.15049446168165, 126.91616067643518 ),//스마트인재개발원 본점 위치 
              level: 3,
            };

            const newMap = new window.kakao.maps.Map(container, options);
            const newMarker = new window.kakao.maps.Marker();

            setMap(newMap);
            setMarker(newMarker);
          });
        }
      });
    });
  }, []);

  // 2) 다우미 우편번호 검색 기능
  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (addrData) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(addrData.address, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const currentPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);

            setAddress(addrData.address);

            map.panTo(currentPos);
            marker.setMap(null);
            marker.setPosition(currentPos);
            marker.setMap(map);
          }
        });
      },
    }).open();
  };

  // 3) 지도 클릭 시 주소 표시
  useDidMountEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        
        lng = mouseEvent.latLng.getLng(); //경도
        lat = mouseEvent.latLng.getLat(); //위도
        console.log("경도:",lng); // 경도 출력
        console.log("위도:", lat);// 위도 출력

        getLatLon(lat,lng)

        geocoder.coord2Address(
          mouseEvent.latLng.getLng(),
          mouseEvent.latLng.getLat(),
          (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const addr = result[0].road_address
                ? result[0].road_address.address_name
                : result[0].address.address_name;

              setAddress(addr);

              marker.setMap(null);
              marker.setPosition(mouseEvent.latLng);
              marker.setMap(map);
            }
          }
        );
      });
    }
  }, [map, marker]);

  return (
    <div>
      <div onClick={onClickAddr}>
        <input id="addr" value={address} readOnly placeholder="Click to search address" />
      </div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
