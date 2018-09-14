// Write by Phuong

import React from 'react';
import PropTypes from 'prop-types';

import './Passcode.scss';

class Passcode extends React.PureComponent {
    
  constructor(props) {
    super(props);    
    this.state = {
      passcodeResult: [-1, -1, -1, -1],
      confirmValue: this.props.confirmValue,
      confirmValueFalse: null,   
      randum: "",   
    }   
  }

  componentDidMount() {
   
  }

  componentWillUnmount() {
   
  }

  onPasscodeClick=(number)=>{
    const onFinish = this.props || null;
    var passcodeResult = this.state.passcodeResult;
    var check = false;
    if (number != -1){
      for (var i = 0; i < passcodeResult.length; i ++){
        if (passcodeResult[i] == -1){
          passcodeResult[i] = number;
          if (i == passcodeResult.length - 1){
            check = true;            
          }
          break;          
        }
      }
      // check pass:
      if (check){
        let valueEnter = parseInt(passcodeResult.join(''));
        console.log(valueEnter);
        if (this.props.confirmValue){          
          if (this.props.confirmValue == valueEnter ){
            console.log("pass confirm", valueEnter);
            this.setState({passcodeResult: passcodeResult, confirmValueFalse: true, randum: Math.random()});            
            if (onFinish){              
              this.props.onFinish(valueEnter);              
            }
          }
          else{            
            this.setState({passcodeResult: [-1, -1, -1, -1], confirmValueFalse: false, randum: Math.random()}, ()=>{
              console.log("not match!", this.state.passcodeResult);
            });
          }
        }
        else{
          console.log("full check", valueEnter);
          if (onFinish){            
            this.setState({passcodeResult: passcodeResult, confirmValueFalse: true, randum: Math.random()});
            this.props.onFinish(valueEnter);
          }
          else{
            this.setState({passcodeResult: passcodeResult, confirmValueFalse: null, randum: Math.random()});            
          }
        }
      }
      else{        
        this.setState({passcodeResult: passcodeResult, confirmValueFalse: null, randum: Math.random()});
      }
                  
    }
    else if (number == -1){ //delete/back
      for (var i = passcodeResult.length-1; i >= 0; i --){
        if (passcodeResult[i] != -1){
          passcodeResult[i] = -1;
          break;
        }
      }
      this.setState({passcodeResult: passcodeResult, confirmValueFalse: null, randum: Math.random()});
    }
  }



  render() {      
    const passcodeResult = this.state.passcodeResult;
    console.log(this.state.passcodeResult);
    
    return (
        
      <div className="passscode">
      <div className="passscode-title">
        Enter your passcode: 
      </div>
      <div className={"passscode-items " + (this.state.confirmValueFalse === false ? "aimation" : '')}>
          <span className={"passscode-item " + (passcodeResult[0] != -1 ? "active" : "")}></span>
          <span className={"passscode-item " + (passcodeResult[1] != -1 ? "active" : "")}></span>
          <span className={"passscode-item " + (passcodeResult[2] != -1 ? "active" : "")}></span>
          <span className={"passscode-item " + (passcodeResult[3] != -1 ? "active" : "")}></span>          
          
      </div>
      <div className="passscode-keyboard">
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(1);}}><span>1</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(2);}}><span>2</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(3);}}><span>3</span></span>

        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(4);}}><span>4</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(5);}}><span>5</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(6);}}><span>6</span></span>

        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(7);}}><span>7</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(8);}}><span>8</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(9);}}><span>9</span></span>
        
        <span className="passscode-keyboard-item disable"> </span>        
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(0);}}><span>0</span></span>
        <span className="passscode-keyboard-item" onClick={()=>{this.onPasscodeClick(-1);}}><span><svg width={40}>
		      <path fill="currentColor" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
	        </svg>
        </span></span>
      </div>

    </div>
    );
  }
}

Passcode.propTypes = {
  confirmValue: PropTypes.number,
  onFinish: PropTypes.func,  
};

export default Passcode;
