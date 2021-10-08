import React, { useState } from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketches/sketch";
import { debounce } from "lodash";
import logo from "./logo.svg";
//import AddIcon from '@material-ui/icons/Add';

import "./App.css";

function App() {
  const [isWave, setWave] = useState(false);

  const [isMouseMoving, setMouseMoving] = useState(false);

  const handleClick = () => {
    setWave(true);
    setTimeout(() => {
      setWave(false);
    }, 600);
  };

  const stopMoving = debounce(() => {
    if (isMouseMoving) setMouseMoving(false);
  }, 150);

  const handleMouseMove = (e) => {
    document.querySelector(
      ".sketch"
    ).style.transform = `perspective(100px) rotateX(${
      -(e.clientY / (window.innerHeight / 2) - 1) / 8
    }deg) rotateY(${
      (e.clientX / (window.innerWidth / 2) - 1) / 16
    }deg) translate(${(window.innerWidth / 2 - e.clientX) * 0.005}px, ${
      (window.innerHeight / 2 - e.clientY) * 0.01
    }px)`;
    if (!isMouseMoving) setMouseMoving(true);
    stopMoving();
  };

  return (
    <div
      onClick={handleClick}
      className="App"
      onTouchMove={handleMouseMove}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseMove}
      onMouseUp={stopMoving}
    >
      <div className="sketch">
        <P5Wrapper {...{ sketch, isWave, isMouseMoving }}></P5Wrapper>
      </div>
      <div className="bg-logo-container">
        <div>
          <img className="bg-logo-blur" src={logo} />
          <img className="bg-logo" src={logo} />
        </div>
      </div>
      <div className="logo">
        <img src={logo} />
      </div>
      <div className="header">
        <div>WORK</div>
        <div>REEL</div>
        <div>ABOUT</div>
        <div>CONTACT</div>
      </div>
      <div className="welcome">
        <div>alucina</div>
        <div>creates</div>
        <div>stunning</div>
        <div>
          <div>products</div>
          <div>
            in the intersection
            <br />
            of atr & technology
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
