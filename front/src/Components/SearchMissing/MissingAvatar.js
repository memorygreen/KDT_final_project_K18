import React, { useEffect, useState } from 'react'
import './MissingAvatar.css';

import avatar from "./assets/avatar.png"

import top_long_black from "./assets/top/top_long_black.png" // 상의 긴팔
import top_long_blue from "./assets/top/top_long_blue.png"
import top_long_brown from "./assets/top/top_long_brown.png"
import top_long_green from "./assets/top/top_long_green.png"
import top_long_grey from "./assets/top/top_long_grey.png"
import top_long_orange from "./assets/top/top_long_orange.png"
import top_long_pink from "./assets/top/top_long_pink.png"
import top_long_purple from "./assets/top/top_long_purple.png"
import top_long_red from "./assets/top/top_long_red.png"
import top_long_white from "./assets/top/top_long_white.png"
import top_long_yellow from "./assets/top/top_long_yellow.png"

import top_short_black from "./assets/top/top_short_black.png" // 상의 반팔
import top_short_blue from "./assets/top/top_short_blue.png"
import top_short_brown from "./assets/top/top_short_brown.png"
import top_short_green from "./assets/top/top_short_green.png"
import top_short_grey from "./assets/top/top_short_grey.png"
import top_short_orange from "./assets/top/top_short_orange.png"
import top_short_pink from "./assets/top/top_short_pink.png"
import top_short_purple from "./assets/top/top_short_purple.png"
import top_short_red from "./assets/top/top_short_red.png"
import top_short_white from "./assets/top/top_short_white.png"
import top_short_yellow from "./assets/top/top_short_yellow.png"


import bottom_long_black from "./assets/bottom/bottom_long_black.png" // 하의 긴바지
import bottom_long_blue from "./assets/bottom/bottom_long_blue.png"
import bottom_long_brown from "./assets/bottom/bottom_long_brown.png"
import bottom_long_green from "./assets/bottom/bottom_long_green.png"
import bottom_long_grey from "./assets/bottom/bottom_long_grey.png"
import bottom_long_orange from "./assets/bottom/bottom_long_orange.png"
import bottom_long_pink from "./assets/bottom/bottom_long_pink.png"
import bottom_long_purple from "./assets/bottom/bottom_long_purple.png"
import bottom_long_red from "./assets/bottom/bottom_long_red.png"
import bottom_long_white from "./assets/bottom/bottom_long_white.png"
import bottom_long_yellow from "./assets/bottom/bottom_long_yellow.png"

import bottom_short_black from "./assets/bottom/bottom_short_black.png" // 하의 반바지
import bottom_short_blue from "./assets/bottom/bottom_short_blue.png"
import bottom_short_brown from "./assets/bottom/bottom_short_brown.png"
import bottom_short_green from "./assets/bottom/bottom_short_green.png"
import bottom_short_grey from "./assets/bottom/bottom_short_grey.png"
import bottom_short_orange from "./assets/bottom/bottom_short_orange.png"
import bottom_short_pink from "./assets/bottom/bottom_short_pink.png"
import bottom_short_purple from "./assets/bottom/bottom_short_purple.png"
import bottom_short_red from "./assets/bottom/bottom_short_red.png"
import bottom_short_white from "./assets/bottom/bottom_short_white.png"
import bottom_short_yellow from "./assets/bottom/bottom_short_yellow.png"

import bottom_skirt_black from "./assets/bottom/bottom_skirt_black.png" // 하의 치마
import bottom_skirt_blue from "./assets/bottom/bottom_skirt_blue.png"
import bottom_skirt_brown from "./assets/bottom/bottom_skirt_brown.png"
import bottom_skirt_green from "./assets/bottom/bottom_skirt_green.png"
import bottom_skirt_grey from "./assets/bottom/bottom_skirt_grey.png"
import bottom_skirt_orange from "./assets/bottom/bottom_skirt_orange.png"
import bottom_skirt_pink from "./assets/bottom/bottom_skirt_pink.png"
import bottom_skirt_purple from "./assets/bottom/bottom_skirt_purple.png"
import bottom_skirt_red from "./assets/bottom/bottom_skirt_red.png"
import bottom_skirt_white from "./assets/bottom/bottom_skirt_white.png"
import bottom_skirt_yellow from "./assets/bottom/bottom_skirt_yellow.png"


import back_pack from "./assets/belongings/backpack.png" // 소지품
import cap from "./assets/belongings/cap.png"
import hand_bag from "./assets/belongings/handbag.png"
import hat from "./assets/belongings/hat.png"
import shouler_bag from "./assets/belongings/shoulderbag.png"

// 이미지 변수 명
const top_long_colors = [
  top_long_red,
  top_long_orange,
  top_long_yellow,
  top_long_green,
  top_long_blue,
  top_long_purple,
  top_long_pink,
  top_long_brown,
  top_long_white,
  top_long_grey,
  top_long_black,
];

const top_short_colors = [
  top_short_red,
  top_short_orange,
  top_short_yellow,
  top_short_green,
  top_short_blue,
  top_short_purple,
  top_short_pink,
  top_short_brown,
  top_short_white,
  top_short_grey,
  top_short_black,
];

const bottom_long_colors = [
  bottom_long_red,
  bottom_long_orange,
  bottom_long_yellow,
  bottom_long_green,
  bottom_long_blue,
  bottom_long_purple,
  bottom_long_pink,
  bottom_long_brown,
  bottom_long_white,
  bottom_long_grey,
  bottom_long_black
];

const bottom_short_colors = [
  bottom_short_red,
  bottom_short_orange,
  bottom_short_yellow,
  bottom_short_green,
  bottom_short_blue,
  bottom_short_purple,
  bottom_short_pink,
  bottom_short_brown,
  bottom_short_white,
  bottom_short_grey,
  bottom_short_black,
];

const bottom_skirt_colors = [
  bottom_skirt_red,
  bottom_skirt_orange,
  bottom_skirt_yellow,
  bottom_skirt_green,
  bottom_skirt_blue,
  bottom_skirt_purple,
  bottom_skirt_pink,
  bottom_skirt_brown,
  bottom_skirt_white,
  bottom_skirt_grey,
  bottom_skirt_black
];

const belongings = [
  back_pack,
  cap,
  hand_bag,
  hat,
  shouler_bag
];

// 사용자가 선택한 실종자 상의
const top_type_ids = ['long_sleeve', 'short_sleeve', 'sleeveless', 'onepice'];
const top_color_ids = ['top_red', 'top_orange', 'top_yellow', 'top_green', 'top_blue', 'top_purple', 'top_pink', 'top_brown', 'top_white', 'top_grey', 'top_black'];
// 사용자가 선택한 실종자  하의
const bottom_type_ids = ['long_pants', 'short_pants', 'skirt', 'bottom_type_none'];
const bottom_color_ids = ['bottom_red', 'bottom_orange', 'bottom_yellow', 'bottom_green', 'bottom_blue', 'bottom_purple', 'bottom_pink', 'bottom_brown', 'bottom_white', 'bottom_grey', 'bottom_black'];
// 사용자가 선택한 실종자 소지품
const belongings_ids = ['carrier', 'umbrella', 'bag', 'hat', 'glasses', 'acc_none'];


export const MissingAvatar = ({
  selectedTop,
  selectedTopColor,
  selectedBottom,
  selectedBottomColor,
  selectedBelongings
}) => {

  // 이미지 상태변수 정의
  const [top_img_src, set_top_img_src] = useState(top_long_white)
  const [bottom_img_src, set_bottom_img_src] = useState(bottom_long_white)
  const [belongings_img_src, set_belongings_img_src] = useState('')

  // 상의 선택
  useEffect(() => {
    if (selectedTop === 'long_sleeve') {
      const colorIndex = top_color_ids.indexOf(selectedTopColor);
      if (colorIndex !== -1) {
        set_top_img_src(top_long_colors[colorIndex]);
      }
    } else if (selectedTop === 'short_sleeve') {
      const colorIndex = top_color_ids.indexOf(selectedTopColor);
      if (colorIndex !== -1) {
        set_top_img_src(top_short_colors[colorIndex]);
      }
    }
  }, [selectedTop, selectedTopColor]); // 의존성 배열에 selectedTop과 selectedTopColor 추가

  // 하의 선택
  useEffect(() => {
    if (selectedBottom === 'long_pants') {
      const colorIndex = bottom_color_ids.indexOf(selectedBottomColor);
      if (colorIndex !== -1) {
        set_bottom_img_src(bottom_long_colors[colorIndex]);
      }
    } else if (selectedBottom === 'short_pants') {
      const colorIndex = bottom_color_ids.indexOf(selectedBottomColor);
      if (colorIndex !== -1) {
        set_bottom_img_src(bottom_short_colors[colorIndex]);
      }
    } else if (selectedBottom === 'skirt') {
      const colorIndex = bottom_color_ids.indexOf(selectedBottomColor);
      if (colorIndex !== -1) {
        set_bottom_img_src(bottom_skirt_colors[colorIndex]);
      }
    }
  }, [selectedBottom, selectedBottomColor]);

  // 소지품 선택
  useEffect(() => {
    const index = belongings_ids.indexOf(selectedBelongings);
    if (index !== -1) {
      set_belongings_img_src(belongings[index]);
    } else {
      set_belongings_img_src(''); // 선택된 소지품이 없는 경우 기본값으로 설정
    }
  }, [selectedBelongings]);


  return (
    <div>

      <h2>아바타 들어올 공간</h2>
      <div>
        <img className='avatarSetting' src={avatar} alt="avatar" />

        <div className='avatarClothes'>

          <img className='img_avatar_top' src={top_img_src} alt="top" />



          <img className='img_avatar_bottom' src={bottom_img_src} alt="bottom" />



          <img className='img_avatar_belonging' src={belongings_img_src} alt="top" />


        </div>
      </div>
    </div>
  )
}
