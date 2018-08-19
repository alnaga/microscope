import React, { Component } from 'react';
import './App.css';
import fs from 'fs';
const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: undefined,
      showImage: false
    }
  }

  viewImage(filePath) {
    console.log(filePath);
    // filePath = 'file:/' + filePath;
    // console.log(filePath);

    if(!this.state.showImage){
      return null
    }

    return (
      <div className="loaded-image">
        <img alt="Content" src={filePath} />
      </div>
    )
  }

  openFile() {
    let microscope = this;
    dialog.showOpenDialog(function (file) {
      if(file === undefined) {
        return;
      }
      else{
        microscope.setState({
          filePath: file[0],
          showImage: true
        });
      }
    });
  }


  render() {
    let microscope = this;
    let {filePath} = this.state;

    return (
      <div className="microscope">

        {!this.state.showImage &&
          <div className="splash">
            <img onClick={function(){microscope.openFile()}} src="./img/splash.svg" alt="Microscope Logo" className="splash-image" />
            <span className="splash-title">Open an Image</span>
          </div>
        }

        {microscope.viewImage(filePath)}

    </div>
    );
  }
}

export default App;
