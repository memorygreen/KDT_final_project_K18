import React, { useEffect, useState, useRef } from 'react';
import './SearchMissing.css';
// useDidMountEffect 훅을 정의. useEffect와 비슷하지만, 이 훅은 첫 번째 렌더링 이후에만 실행
function useDidMountEffect(func, deps) {
  const didMount = useRef(false); //첫 번째 렌더링인지 여부를 판단

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
}

// 카카오맵을 로드하고, 마커를 표시, 사용자가 클릭한 위치의 위도와 경도를 부모 컴포넌트에 전달
export default function MissingKakaoMap({ getLatLon, getMissingLocation, missingLocation, initialLat, initialLng }) {
  const [map, setMap] = useState(null); // 카카오맵 객체를 저장하는 상태 변수 
  const [marker, setMarker] = useState(null); // 지도에 표시할 마커 객체를 저장하는 상태 변수
  const [address, setAddress] = useState(missingLocation || ''); // 클릭한 위치나 검색한 주소를 저장하는 상태 변수

  // lng, lat 위도 경도 전역변수 설정
  let lng = 0;
  let lat = 0;

  // 카카오맵 및 우편번 검색 서비스 스크립트 로드
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
              center: new window.kakao.maps.LatLng(
                initialLat || 35.15049446168165, 
                initialLng || 126.91616067643518
              ),
              level: 3,
            };

            const newMap = new window.kakao.maps.Map(container, options); // 새로운 지도 변수
            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                initialLat || 35.15049446168165, 
                initialLng || 126.91616067643518
              )
            }); // 새로운 마커 변수

            newMarker.setMap(newMap);
            setMap(newMap);
            setMarker(newMarker); // 새로온 마커 변수 값 업데이트(세팅)

            // 이미 주소가 들어있는 경우 해당 주소에 마커 표시
            if (address) {
              const geocoder = new window.kakao.maps.services.Geocoder();
              geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                  const currentPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                  newMarker.setPosition(currentPos);
                  newMarker.setMap(newMap);
                  newMap.panTo(currentPos);
                }
              });
            }
          });
        }
      });
    });
  }, [initialLat, initialLng]); // 의존성 배열에 initialLat와 initialLng 추가

  // 우편번호 검색 기능
  const onClickAddr = () => {
    new window.daum.Postcode({
      oncomplete: function (addrData) {
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(addrData.address, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const currentPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            setAddress(addrData.address);
            getMissingLocation(addrData.address); // 부모 컴포넌트로 주소 전달
            map.panTo(currentPos);
            marker.setPosition(currentPos);
            marker.setMap(map);
          }
        });
      },
    }).open();
  };

  // 지도 클릭 시 주소 표시
  useDidMountEffect(() => {
    if (map) {
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const geocoder = new window.kakao.maps.services.Geocoder();

        lng = mouseEvent.latLng.getLng();
        lat = mouseEvent.latLng.getLat();
        console.log("경도:", lng);
        console.log("위도:", lat);

        getLatLon(lat, lng);

        geocoder.coord2Address(mouseEvent.latLng.getLng(), mouseEvent.latLng.getLat(), (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            var addr = result[0].road_address
              ? result[0].road_address.address_name
              : result[0].address.address_name;
            setAddress(addr);
            getMissingLocation(addr); // 부모 컴포넌트로 주소 전달
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);
          }
        });
      });
    }
  }, [map, marker]);

  // address가 변경될 때마다 마커를 업데이트
  useEffect(() => {
    if (map && address) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const newPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          marker.setPosition(newPos);
          marker.setMap(map);
          map.panTo(newPos);
        }
      });
    }
  }, [address, map, marker]);

  return (
    <div>
      <div onClick={onClickAddr}>
        <input id="addr" value={address}  placeholder={address?address:"주소를 클릭하여 선택해주세요"} className='input_etc' />
      </div>
      <div id="map"  style={{ width: "100%", height: "400px"} }></div>
    </div>
  );
}
