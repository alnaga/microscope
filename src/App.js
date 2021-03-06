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
      rotation: {
        transform: 'rotate(0deg)'
      },
      showImage: false,
      showHelp: false
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
      });
    });

    window.addEventListener('keydown', (e) => {
      switch(e.key){
        case 'h':
          e.preventDefault();
          this.setState({
            showHelp: !this.state.showHelp
          })
          break;
        case 'l':
          e.preventDefault();
          this.handleRotateLeft();
          break;
        case 'r':
          e.preventDefault();
          this.handleRotateRight();
          break;
        case 'x':
          e.preventDefault();
          this.handleCloseImage();
          break;
        default:
          return;
      }
    });
  }


  handleLoadImage() {
    let { imageDimensions = null, windowDimensions } = this.state;
    this.setState({
      rotation: {
        transform: 'rotate(0deg)'
      }
    })
    if(imageDimensions.width > windowDimensions.width || imageDimensions.height > windowDimensions.height){
        this.setState({
          pannable: true
        });
    }
    else {
      this.setState({
        pannable: false
      });
    }
  }

  handleCloseImage() {
    this.setState({
      filePath: undefined,
      showImage: false
    });
  }

  handleRotateLeft() {
    let rotate = this.state.rotation.transform;
    rotate = parseInt(rotate.substring(7, rotate.length-4));
    if(rotate == 0){
      rotate = 355;
    }
    else{
      rotate = rotate - 5;
    }
    this.setState({
      rotation: {
        transform: "rotate(" + (rotate) + "deg)"
      }
    });
  }

  handleRotateRight() {
    let rotate = this.state.rotation.transform;
    rotate = parseInt(rotate.substring(7, rotate.length-4));
    if(rotate == 355){
      rotate = 0;
    }
    else{
      rotate = rotate + 5;
    }
    this.setState({
      rotation: {
        transform: "rotate(" + (rotate) + "deg)"
      }
    });
  }

  handleDisplayHelp() {
    return (
      <div className="help-container">
        <span className="help-title"> Microscope Help Menu:<br/><br/> </span>
        h - Toggle help menu<br/>
        l - Rotate Left<br/>
        r - Rotate Right<br/>
        x - Close Image<br/>
      </div>
    )
  }

  handleDisplayImage(filePath) {
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

          src={filePath}

          style={this.state.rotation} />
      </div>
    )
  }

  handleDisplayPrompt() {
    return (
      <div className="splash">
        <img onMouseDown={(e) => e.preventDefault()} onClick={() => {this.openFile()}} src="./img/splash.svg" alt="Microscope Logo" className="splash-image" />
        <span onMouseDown={(e) => e.preventDefault()} className="splash-title">Open an Image File</span>
      </div>
    );
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

  getImagePannableClass() {
    return this.state.pannable ? 'pannable' : '';
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
    let { filePath } = this.state;

    return (
      <div className="microscope">

        {!this.state.showImage &&
          this.handleDisplayPrompt()
        }

        {this.state.showHelp &&
          this.handleDisplayHelp()
        }
        {this.state.showImage &&
          this.handleDisplayImage(filePath)
        }

    </div>
    );
  }
}

export default App;
