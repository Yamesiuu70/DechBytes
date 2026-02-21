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
import { Link } from 'react-router-dom';
import './style.css';

const ProductItem = ({ img, name, title, price, oldPrice }) => {
  const discount = oldPrice && price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

  return (
    <div className="productItem">
      <div className="imgWrapper">
        <img src={img} alt={name} />
        {discount > 0 && <span className="discount">{discount}%</span>}
      </div>

      <div className="info">
        <h6><Link to="/" className="link">{name}</Link></h6>
        <h3 className="title"><Link to="/" className="link">{title}</Link></h3>
        <div className="price-row">
          {oldPrice && <span className="oldPrice">${oldPrice.toFixed(2)}</span>}
          {price && <span className="price">${price.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;