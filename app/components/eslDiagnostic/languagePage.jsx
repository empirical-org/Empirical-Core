import React from 'react';

export default class LanguagePage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <p>Hello there! You are about to start a 22 question Placement Activity. First, let’s set up your language preference</p>
        <p>All the directions are in:</p>
        <p><span>English</span>(Default)</p>
        <p>and I want <span>additional</span> directions in:</p>
        <div>Español</div>
        <div>中文</div>
        <div>Français</div>
        <div>Tiếng Việt</div>
        <div>العربية</div>
        <div>हिंदी</div>
        <div>No translations needed - Show only English</div>
      </div>
    );
  }
}
