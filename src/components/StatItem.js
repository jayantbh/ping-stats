import React from 'react';
import './StatItem.css'

export default function StatItem(props) {
  return (
    <div className="vertical-el">
      <div className="wrapper">
        <div className="title">{props.title}</div>
        <div className="content">{props.content || 'Loading...'}</div>
        <div className="title">{props.subtitle}</div>
      </div>
    </div>
  );
}