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
import ProductItem from './index';

// import 12 images
import item1 from './item1.jpg';
import item2 from './item2.jpg';
import item3 from './item3.jpg';
import item4 from './item4.jpg';
import item5 from './item5.jpg';
import item6 from './item6.jpg';
import item7 from './item7.jpg';
import item8 from './item8.jpg';
import item9 from './item9.jpg';
import item10 from './item10.jpg';
import item11 from './item11.jpg';
import item12 from './item12.jpg';

const products = [
  { img: item1, name: "Prosthetic Legs", title: " High-Activity/Sports Prosthetic Legs", price: 45, oldPrice: 58 },
  { img: item2, name: "Prebuilt PC", title: "Custom Ryzen PC ", price: 60, oldPrice: 80 },
  { img: item3, name: "HP Laptop", title: "HP Office Laptop", price: 30, oldPrice: 50 },
  { img: item4, name: " A56", title: "Samsung Galaxy A56 128gb", price: 75, oldPrice: 90 },
  { img: item5, name: "Bionic Arm", title: "High-Tech Myoelectric Prosthetic Arms", price: 95, oldPrice: 120 },
  { img: item6, name: "Raspberry Pi", title: "Raspberry Pi 5 (Latest Model)", price: 85, oldPrice: 110 },
  { img: item7, name: "Prosthetic Legs", title: "Stainless Steel/Cast Aluminum Arms", price: 55, oldPrice: 70 },
  { img: item8, name: "Artificial Legs", title: "Stainless Steel/Cast Aluminum Legs", price: 40, oldPrice: 55 },
  { img: item9, name: "Silicon Cosmetic Cover Legs", title: "Hyper-Realistic Custom Skin Prosthetics", price: 70, oldPrice: 85 },
  { img: item10, name: "NAND IC", title: "7400 IC ", price: 50, oldPrice: 65 },
  { img: item11, name: "Arduino Starter Kit (Official)", title: "Variable Power Supply DIY Kit", price: 35, oldPrice: 50 },
  { img: item12, name: "Raspberry Pi 4", title: "Broadcom BCM2711; Quad-core Cortex-A72", price: 60, oldPrice: 75 },
];

const ProductList = () => {
  return (
    <div className="productsGrid">
      {products.map((product, index) => (
        <ProductItem
          key={index}
          img={product.img}
          name={product.name}
          title={product.title}
          price={product.price}
          oldPrice={product.oldPrice}
        />
      ))}
    </div>
  );
};

export default ProductList;