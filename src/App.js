import React, { Component } from 'react';
import './App.css';

class App extends Component {


  render() {

    return (
      <div className="microscope">
        <div class="splash">
          <img src="./img/splash.png" alt="Microscope Logo" class="splash-image"></img>
          <span class="splash-title">Open an image.</span>
        </div>
    </div>
    );
  }
}

export default App;
