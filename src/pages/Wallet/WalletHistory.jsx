import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js'
import {Ethereum} from '@/models/Ethereum.js'
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

import Button from '@/components/core/controls/Button';
import Checkbox from '@/components/core/forms/Checkbox/Checkbox';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import createForm from '@/components/core/form/createForm';
import { differenceWith } from 'lodash';

class WalletHistory extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
    };

    console.log("constructor", this.state.step);
  }

	async componentDidMount() {
    //reset state

    //this.setState({step1_confirm: false, step: 1, arr_confirm: []});
    console.log(this.state.step);
	}

  get show_header() {
    const {wallet} = this.props;

    if(wallet){
      return (
      <div id="hw-header" class="row">
        <div class="name col-sm-8 p-1">{wallet.name}</div>
        <div class="balance text-primary col-sm-4 p-1">{wallet.balance} {wallet.name}</div>
        <div class="address">{wallet.address}</div>
      </div>);
    }
    else
      return "";
  }


  get list_transaction() {
    const {wallet} = this.props;

    if(wallet){
      return (
      <div class="card bg-light">
        <div class="balance">{wallet.balance} {wallet.name}</div>
        <div class="name">{wallet.name}</div>
        <div class="address">{wallet.address}</div>
      </div>);
    }
    else
      return "";
  }

	render(){
    const {wallet} = this.props;

		return (
      <div class="historywallet-wrapper">
        {this.show_header}
        {this.list_transaction}
      </div>
		);
	}
}

WalletHistory.propTypes = {
  wallet: PropTypes.object
};

const mapState = (state) => ({

});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletHistory);
