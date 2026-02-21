// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import BannerBox from '../BannerBox';
import './style.css';

// Import images
import banner1 from './banner1.jpg';
import banner2 from './banner2.jpg';
import banner3 from './banner3.jpg';
import banner4 from './banner4.jpg';
import banner5 from './banner5.jpg';
import banner6 from './banner6.jpg';
import banner7 from './banner7.jpg';

const AdsBannerSlider = ({ items }) => {
  return (
    <div className="ads-banner-slider">
      <Swiper
        slidesPerView={items}
        spaceBetween={10}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="ads-swiper"
      >
        <SwiperSlide><BannerBox img={banner1} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner2} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner3} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner4} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner5} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner6} link="/" /></SwiperSlide>
        <SwiperSlide><BannerBox img={banner7} link="/" /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;