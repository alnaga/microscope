import React, { Component } from 'react';
import './App.css';
// import _ from 'underscore';
const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageDimensions: {},
      windowDimensions: {
        height: document.body.clientHeight,
        width: document.body.clientWidth
      },
      filePath: undefined,
      mouseX: undefined,
      mouseY: undefined,
      pannable: false,
      panning: false,
      showImage: false
    }
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        windowDimensions:{
          height: document.body.clientHeight,
          width: document.body.clientWidth,
        }
      });
      this.handleLoadImage();
    });

    window.addEventListener('mouseout', () => {
      this.setState({
        panning: false
      })
    });

    window.addEventListener('keydown', (e) => {
      switch(e.key){
        case 'x':
          this.handleCloseImage();
          break;
        default:
          return;
      }
    });
  }

  getImageDimensions = ({ target: image }) => {
    if(!this.state.showImage){
      return;
    }

    this.setState({
      imageDimensions:{
        height: image.offsetHeight,
        width: image.offsetWidth
      }
    });

    setTimeout(
      () => {
        this.handleLoadImage();
      }, 1
    );
  }

  handleLoadImage() {
    let { imageDimensions = null, windowDimensions } = this.state;
    if(imageDimensions.width > windowDimensions.width || imageDimensions.height > windowDimensions.height){
        this.setState({
          pannable: true
        })
    }
    else {
      this.setState({
        pannable: false
      })
    }
  }

  handleCloseImage() {
    this.setState({
      filePath: undefined,
      showImage: false
    });
  }

  getImagePannableClass() {
    return this.state.pannable ? 'pannable' : '';
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
      <div className={`loaded-image ${this.getImagePannableClass()}`}>
      <img
          alt="Content"
          onMouseDown={ (e) => {
            this.startPan(e)
          }}

          onMouseMove={ (e) => {
            this.imagePan(e)
          }}

          onMouseUp={ (e) => {
            this.stopPan(e)
          }}

          onLoad={
            this.getImageDimensions
          }

          src={filePath} />
      </div>
    )
  }

  openFile() {
    dialog.showOpenDialog((file) => {
      if(file === undefined) {
        return;
      }
      else{
        this.setState({
          filePath: file[0],
          showImage: true
        });
      }
    });
  }

  startPan(e) {
    e.preventDefault()
    if(!this.state.pannable) {
      return;
    }

    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY,
      panning: true
    });
  }

  imagePan(e) {
    let { mouseX, mouseY } = this.state;
    if(!this.state.panning) {
      return;
    }

    setTimeout(
      this.setState({
        mouseX: e.clientX,
        mouseY: e.clientY
      }), 1
    )

    let dX = e.clientX - mouseX;
    let dY = e.clientY - mouseY;

    window.scrollTo(window.scrollX + dX*-1.5, window.scrollY + dY*-1.5);
  }

  stopPan(e) {
    if(!this.state.pannable) {
      return;
    }

    this.setState({
      panning: false
    })
  }

  render() {
    let microscope = this;
    let { filePath } = this.state;

    return (
      <div className="microscope">

        {!this.state.showImage &&
          <div className="splash">
            <img onMouseDown={(e) => e.preventDefault()} onClick={function(){microscope.openFile()}} src="./img/splash.svg" alt="Microscope Logo" className="splash-image" />
            <span onMouseDown={(e) => e.preventDefault()} className="splash-title">Open an Image File</span>
          </div>
        }

        {this.state.showImage &&
          microscope.viewImage(filePath)
        }

    </div>
    );
  }
}

export default App;
