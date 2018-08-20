import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
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

  componentDidUpdate() {
    if(this.state.showImage){
      const image = document.getElementsByClassName('loaded-image');
      console.log(image);
      console.log(image[0].clientHeight);
      console.log(image[0].clientWidth);
    }
  }

  viewImage(filePath) {
    filePath = 'file://' + filePath;
    let microscope = this;
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
      <div className='loaded-image'>
      <img
          alt="Content"
          onMouseDown={function(e){
            microscope.startPan(e)
          }}

          onMouseUp={function(e){
            microscope.stopPan(e)
          }}

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
