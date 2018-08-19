import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {

    let renderTitle = () => {
      return (
        <h1 className="micro-title">Microscope</h1>
      )
    }

    let renderContent = () => {
      return (
        <p>
          Content placeholder
        </p>
      )
    }

    return (
      <div className="microscope">
        <header className="micro-header">
          {renderTitle()}
        </header>
          {renderContent()}
      </div>
    );
  }
}

export default App;
