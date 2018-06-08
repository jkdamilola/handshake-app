import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, SIDE, BETTING_STATUS_LABEL, ROLE} from './BetHandshakeHandler.js';
import momment from 'moment';
import {MasterWallet} from '@/models/MasterWallet';

import local from '@/services/localStore';
import {FIREBASE_PATH, HANDSHAKE_ID, API_URL, APP} from '@/constants';
import { BettingHandshake } from '@/services/neuron';
import { uninitItem, collect, refund, rollback } from '@/reducers/handshake/action';
import { loadMyHandshakeList} from '@/reducers/me/action';


// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';

// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
const bettinghandshake = new BettingHandshake(chainId);
class FeedBetting extends React.Component {
  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
      super(props);

      this.state = {
        actionTitle: null,
        statusTitle: null,
        isAction: false,
        role: null,
        isMatch: false,
      };


  }

  get isMatch(){
    const {shakeUserIds} = this.props;
    if(shakeUserIds){
      return shakeUserIds.length > 0 ? true : false;

    }
    return false;
  }

  isShakeUser(shakeIds, userId){
    console.log('User Id:', userId);
    console.log('ShakeIds:', shakeIds);

    if(shakeIds){

      if(shakeIds.indexOf(userId) > -1){
        return true;

      }

    }
  }
  handleStatus(){
    const {status, side, result, shakeUserIds} = this.props;

    console.log('Props:', this.props);
    console.log('Status:', status);
    const profile = local.get(APP.AUTH_PROFILE);
    const isUserShake = this.isShakeUser(shakeUserIds, profile.id);
    const role = isUserShake ? ROLE.SHAKER : ROLE.INITER;
    //const blockchainStatusHardcode = 5;
    const isMatch = this.isMatch;
    //const isMatch = true;
    //const hardCodeResult = 2;
    console.log('Is Match:', isMatch);

    const statusResult = BetHandshakeHandler.getStatusLabel(status, result, role,side, isMatch);
    const {title, isAction} = statusResult;
    this.setState({
      actionTitle: title,
      statusTitle: statusResult.status,
      isAction,
      role,
      isMatch,
    })
  }

  componentDidMount() {
    this.handleStatus();

  }

  componentWillReceiveProps(nextProps) {
    console.log('Feeding Next Props:', nextProps);
    this.handleStatus();
  }

  get extraData(){
    const {extraData} = this.props
    try {
      return JSON.parse(extraData);
    }catch(e){
      console.log(e);
      return {}
    }
  }

  renderStatus = () => {
    const {statusTitle} = this.state;
    const text = "Match is ongoing...";
    //const textColor = status == 2?'white':'#35B371';
    const textColor = 'white';
    const label = statusTitle ? statusTitle : '';
    //const backgroundColorWithStatus = status == 2? 'ffffff25' :'#00000030';
    const backgroundColorWithStatus = '#ffffff25';
    return <Button style={{backgroundColor:backgroundColorWithStatus , borderColor:'transparent',color:textColor}}  block disabled >{label}</Button>;
  }

  render() {
    const {actionTitle , isAction,side } = this.state;
    const backgroundColor = side === SIDE.SUPPORT ? "#85D477":'#FB7753';
    // const {actionTitle = "Match is ongoing...", isAction =true} = this.state;
     /***
     * side = SIDE.SUPPORT // SIDE.AGAINST ;ORGRANCE
     *
     */
    const {amount, odds, winValue} = this.props;
    const {event_name, event_predict, event_odds, event_bet,event_date, balance} = this.extraData;
    const { commentCount, id, type } = this.props;
    const realEventName = event_name ? event_name.slice(7).split('(') : ['', ''];
    const matchName = realEventName[0];
    const matchDate = `(${realEventName[1]}`;

    return (
      <div>
        {/* Feed */}
        <Feed
          className="wrapperBettingFeed"
          handshakeId={this.props.id}
          onClick={this.props.onFeedClick}
        >
            <div className="description">
              <p className="eventName">
                {matchName} <span className="matchDate">{matchDate}</span>
              </p>
              <p className="eventInfo">{event_predict.slice(8)}</p>
            </div>
            <div className="bottomWrapper">
              <span className="odds" >{odds.toFixed(2)}</span>
              <span className="content">{amount} ETH</span>
            </div>
            <div className="possibleWin">Possible win {winValue} ETH</div>

            {this.renderStatus()}
        </Feed>
        {/* Shake */}
        {actionTitle && <Button block disabled={!isAction} onClick={() => { this.clickActionButton(actionTitle); }}>{actionTitle}</Button>}
        {/* Modal */}
        {/*<ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
    </ModalDialog>*/}
      </div>
    );

  }
  changeOption(value){
    console.log('Choose option:', value)
    //TO DO: Choose an option
  }

  clickActionButton(title){
    const {id} = this.props;
    const realId = BetHandshakeHandler.getId(id);
    console.log('realId:', realId);

    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        this.uninitItem(realId);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        this.collect(id);
        break;
      case BETTING_STATUS_LABEL.REFUND:
      this.refund(realId);
      break;

    }
    this.loadMyHandshakeList();


  }
  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }
  uninitItem(id){
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE.concat(`/${id}`);
    this.props.uninitItem({PATH_URL: url, METHOD:'POST',
    successFn: this.uninitHandshakeSuccess,
    errorFn: this.uninitHandshakeFailed
  });
  }
  uninitHandshakeSuccess= async (successData)=>{
    console.log("uninitHandshakeSuccess", successData);
    const {status, data} = successData
    if(status && data){
      const {hid, side, amount, odds, offchain} = data;
      const stake = amount;
      const payout = stake * odds;
      bettinghandshake.cancelBet(hid, side, stake, payout, offchain);

    }
  }
  uninitHandshakeFailed = (error) => {
    console.log('uninitHandshakeFailed', error);
  }

  collect(id){
    let params = {
      offchain: id
    }
    this.props.collect({PATH_URL: API_URL.CRYPTOSIGN.COLLECT, METHOD:'POST',data: params,
    successFn: this.collectSuccess,
    errorFn: this.collectFailed
  });
  }

  collectSuccess = async (successData)=>{
    console.log('collectSuccess', successData);
    const {status} = successData
    if(status){
      const {hid, id} = this.props;
      const offchain = id;

      bettinghandshake.withdraw(hid, offchain);

    }
  }
  collectFailed = (error) => {
    console.log('collectFailed', error);

  }

  refund(id){
    const url = API_URL.CRYPTOSIGN.REFUND.concat(`/${id}`);
    this.props.refund({PATH_URL: API_URL.CRYPTOSIGN.REFUND, METHOD:'POST',
    successFn: this.refundSuccess,
    errorFn: this.refundFailed
  });
  }

  refundSuccess = async (successData)=>{
    console.log('refundSuccess', successData);
    const {status} = successData
    if(status){
      const {hid, id} = this.props;
      const offchain = id;
      bettinghandshake.refund(hid, offchain);
    }
  }
  refundFailed = (error) => {
    console.log('refundFailed', error);
  }

  rollback(id, offchain){
    const params = {
      offchain
    }
    const url = API_URL.CRYPTOSIGN.ROLLBACK.concat(id);
    this.props.rollback({PATH_URL: url, METHOD:'POST', data: params,
    successFn: this.rollbackSuccess,
    errorFn: this.rollbackFailed
  });
  }
  rollbackSuccess = async (successData)=>{
    console.log('rollbackSuccess', successData);
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
  loadMyHandshakeList,
  uninitItem,
  collect,
  refund,
  rollback
});
export default connect(mapState, mapDispatch)(FeedBetting);
