import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './body.css';
import logo from '../footer/1.png';
import Banner from 'react-js-banner';

function MainBanner() {
  return (
    <div className="App">
      <div className="background">
        <div className="container">
          <Banner
            title="This is an example banner with CSS and Image"
            image={logo}
            imageClass="Applogo"
          />
        </div>
      </div>
    </div>
  )
}

export default MainBanner
