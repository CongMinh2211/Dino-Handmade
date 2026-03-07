import React from 'react';
import zaloImg from '../../img/zalo.png';

export const ZaloIcon = ({ width = 24, height = 24, className = '' }) => (
  <img 
    src={zaloImg} 
    alt="Zalo" 
    width={width} 
    height={height} 
    className={className}
    style={{ objectFit: 'contain', verticalAlign: 'middle' }}
  />
);
