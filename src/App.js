import React, { Component } from 'react';
import './App.css';
import _ from 'underscore';
const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageDimensions: {},
      windowDimensions: {},
      filePath: undefined,
      pannable: false,
      showImage: false
    }
    this.getDimensions = this.getDimensions.bind(this);
  }

  getDimensions({ target: image }) {
    this.setState({
      imageDimensions:{
        height: image.offsetHeight,
        width: image.offsetWidth
      },
      windowDimensions:{
        height: window.innerHeight,
        width: window.innerWidth,
      }
    });
    setTimeout(
      () => {
        this.onLoadImage();
      }, 1
    );
  }

  onLoadImage() {
    let { imageDimensions = null, windowDimensions = null } = this.state;
    if(imageDimensions.width > windowDimensions.width
      ||
      imageDimensions.height > windowDimensions.height){
      this.setState({
        pannable: true
      })
    }

  }

  viewImage(filePath) {
    filePath = 'file://' + filePath;
    let extension = filePath.split('.').pop().toLowerCase();
    let supportedFileTypes = ['png', 'jpg', 'jpeg'];

    if(!this.state.showImage){
      return null;
    }

    if(extension !== undefined && !supportedFileTypes.includes(extension)){
      this.setState({
        showImage: false
      });
      return null;
    }

    return (
      <div className={this.state.pannable ? 'loaded-image pannable' : 'loaded-image'}>
      <img
          alt="Content"
          onMouseDown={ (e) => {
            this.startPan(e)
          }}

          onMouseUp={ (e) => {
            this.stopPan(e)
          }}

          onLoad={this.getDimensions}

          src={filePath} />
      </div>
    )
  }

  isPannable(image) {
    console.log(image.clientWidth, image.offsetHeight);
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

  startPan(e) {
    e.preventDefault()
    console.log('should pan');
  }

  stopPan(e) {
    console.log('stopped panning');
  }

  render() {
    let microscope = this;
    let { filePath } = this.state;

    return (
      <div className="microscope">

        {!this.state.showImage &&
          <div className="splash">
            <img onClick={function(){microscope.openFile()}} src="./img/splash.svg" alt="Microscope Logo" className="splash-image" />
            <span className="splash-title">Open an Image File</span>
          </div>
        }

        {microscope.viewImage(filePath)}

    </div>
    );
  }
}

export default App;
