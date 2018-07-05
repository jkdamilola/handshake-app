import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { shakeItem, initFreeHandshake, } from '@/reducers/handshake/action';
import {HANDSHAKE_ID, API_URL, APP } from '@/constants';
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import local from '@/services/localStore';
import moment from 'moment';

// components
import { InputField } from '@/components/handshakes/betting/form/customField';
import Button from '@/components/core/controls/Button';

import { showAlert } from '@/reducers/app/action';
import {
  getMessageWithCode, isExpiredDate, getChainIdDefaultWallet, getBalance,
  getEstimateGas, getAddress, isRightNetwork,
} from '@/components/handshakes/betting/utils';
import { BetHandshakeHandler, MESSAGE, SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

import './ShakeFree.scss';
import Toggle from './../Toggle';
import BigNumber from 'bignumber.js';
import {parseBigNumber} from '@/components/handshakes/betting/utils.js';


const betHandshakeHandler = BetHandshakeHandler.getShareManager();

const ROUND = 1000000;
const ROUND_ODD = 10;

class BetingShakeFree extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    outcomeHid: PropTypes.number,
    matchName: PropTypes.string,
    matchOutcome: PropTypes.string,
    marketSupportOdds: PropTypes.number,
    marketAgainstOdds: PropTypes.number,
    amount: PropTypes.number,
    closingDate: PropTypes.any,
    reportTime: PropTypes.any,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
  }

  static defaultProps = {
    outcomeId: -1,
  };


  constructor(props) {
    super(props);

    this.state = {
      buttonClass: 'btnOK btnBlue',
      isShowOdds: true,
      extraData: {},
      isChangeOdds: false,
      marketOdds: 0,
      oddValue: 0,
      amountValue: 0,
      winValue: 0,
      disable: false,

    };


    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { marketSupportOdds, marketAgainstOdds } = this.props;
    const { amount } = this.props;
    const marketOdds = this.toggleRef.value === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;
    const winValue = amount * marketOdds;
    const roundWinValue = Math.floor(winValue * ROUND) / ROUND;

    console.log('Next props: amount, marketOdds, winValue, roundWinValue: ', amount, marketOdds, winValue, roundWinValue);

    this.setState({
      oddValue: Math.floor(marketOdds * ROUND_ODD) / ROUND_ODD,
      amountValue: amount,
      winValue: roundWinValue,
    });
  }


  async onSubmit(e) {
    e.preventDefault();
    const values = this.refs;
    console.log('Values:', values);
    this.setState({
      disable: true,
    });
    const { isShowOdds, isChangeOdds } = this.state;
    const {
      matchName, matchOutcome, amount, marketAgainstOdds, marketSupportOdds, closingDate, reportTime,
    } = this.props;
    const amountS = new BigNumber(amount);
    // const amount = parseFloat(values.amount.value);
    const side = parseInt(this.toggleRef.value, 10);

    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    const balance = new BigNumber(await getBalance());
    const estimatedGas = new BigNumber(await getEstimateGas());
    const odds = new BigNumber(this.refs.odds.value);
    const total = amountS.plus(estimatedGas);

    let message = null;
    if (!isRightNetwork()) {
      message = MESSAGE.RIGHT_NETWORK;
    } else if (isExpiredDate(closingDate)) {
      message = MESSAGE.MATCH_OVER;
    } else if (matchName && matchOutcome) {
      if (odds.gt(1)) {
        this.initHandshake(amount, odds);
        this.props.onSubmitClick();
      } else {
        message = MESSAGE.ODD_LARGE_THAN;
      }
    } else {
      message = MESSAGE.CHOOSE_MATCH;
    }

    if (message) {
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
      this.setState({ disable: false });
    }
  }

  onCancel() {
    console.log('Cancel');
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    // const {isChangeOdds} = this.state;
    const { marketAgainstOdds, marketSupportOdds } = this.props;
    const side = this.toggleRef.value;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    /*
    if(!isChangeOdds){
      this.setState({
        oddValue: parseFloat(marketOdds).toFixed(2)
      }, ()=> this.updateTotal());
    }
    */

    this.setState({
      oddValue: marketOdds.toFixed(2,1),
    }, () => this.updateTotal());


    this.setState({ buttonClass: `btnOK ${id === 1 ? 'btnBlue' : 'btnRed'}` });
  }

  updateTotal() {
    const { oddValue, amountValue } = this.state;
    const total = parseBigNumber(oddValue).times(parseBigNumber(amountValue));
    this.setState({
      winValue: total.toFixed(6,1),
    });
  }

  shakeItem(amount, side) {
    const { outcomeId } = this.props;
    const { extraData } = this.state;
    const { matchName, matchOutcome, outcomeHid } = this.props;
    extraData.event_name = matchName;
    extraData.event_predict = matchOutcome;
    extraData.event_bet = amount;
    this.setState({
      extraData,
    });
    console.log('Props:', this.props);

    const params = {
      // to_address: toAddress ? toAddress.trim() : '',
      // public: isPublic,
      // description: content,
      // description: JSON.stringify(extraParams),
      // industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      // type: 3,
      // extra_data: JSON.stringify(fields),
      outcome_id: outcomeId,
      extra_data: JSON.stringify(extraData),
      amount,
      currency: 'ETH',
      side,
      chain_id: getChainIdDefaultWallet(),
      from_address: getAddress(),
    };
    console.log(params);

    this.props.shakeItem({
      PATH_URL: API_URL.CRYPTOSIGN.SHAKE,
      METHOD: 'POST',
      data: params,
      successFn: this.shakeItemSuccess,
      errorFn: this.shakeItemFailed,
    });
  }

  shakeItemSuccess = async (successData) => {
    console.log('shakeItemSuccess', successData);
    const { status, data, message } = successData;
    if (status) {
      const { outcomeHid } = this.props;
      betHandshakeHandler.controlShake(data, outcomeHid);
      this.props.showAlert({
        message: <div className="text-center">{MESSAGE.CREATE_BET_SUCCESSFUL}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
    } else {
      // TO DO: Show message, show odd field
      /*
      this.setState({
        isShowOdds: true,
      }, ()=> {
        const {message} = successData
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
      })
      */

      const { message } = successData;
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }
  shakeItemFailed = (errorData) => {
    console.log('shakeItemFailed', errorData);
    const { status } = errorData;
    if (status === 0) {
      this.setState({
        isShowOdds: true,
      }, () => {
        const { message } = errorData;
        this.props.showAlert({
          message: <div className="text-center">{message}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        });
      });
    }
  }

  initHandshake(amount, odds) {
    const { outcomeId, matchName, matchOutcome } = this.props;
    const { extraData } = this.state;
    const side = this.toggleRef.value;
    const fromAddress = getAddress();
    extraData.event_name = matchName;
    extraData.event_predict = matchOutcome;
    extraData.event_odds = odds;
    extraData.event_bet = amount;
    console.log('Extra Data:', extraData);
    const params = {

      type: HANDSHAKE_ID.BETTING,

      outcome_id: outcomeId,
      odds: `${odds}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: parseInt(side, 10),
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };
    console.log('Params:', params);


    this.props.initFreeHandshake({
      PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE_FREE,
      METHOD: 'POST',
      data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.initHandshakeFailed,
    });
  }

  initHandshakeSuccess = async (successData) => {
    console.log('initHandshakeSuccess', successData);
    const { status, data } = successData;

    if (status && data) {
      const { outcomeHid } = this.props;
      console.log('OutcomeHid:', outcomeHid);
      const { match } = data;
      const isExist = match;
      let message = MESSAGE.CREATE_BET_NOT_MATCH;
      if (isExist) {
        message = MESSAGE.CREATE_BET_MATCHED;
      }
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
    }
    // this.props.onSubmitClick();
  }

  initHandshakeFailed = (errorData) => {
    console.log('initHandshakeFailed', errorData);
    const { status, code } = errorData;
    if (status === 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }

  renderInputField(props) {
    const {
      label,
      className,
      id,
      infoText = 'ETH',
      isShowInfoText = true,
      type = 'text',
      value,
      defaultValue,
      isInput = true,
      ...newProps
    } = props;
    const { oddValue, amountValue } = this.state;
    console.log('Label Default Value:', label, defaultValue);
    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <input
              ref={id}
              // component={InputField}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              // defaultValue={defaultValue}
              value={id === 'odds' ? oddValue : amountValue}
              // value={value}
              {...newProps}
              onChange={(evt) => {
                if (id === 'odds') {
                  console.log('Change Odds');
                  this.setState({
                    oddValue: evt.target.value,
                    isChangeOdds: true,
                  }, () => this.updateTotal());
                } else {
                  this.setState({
                    amountValue: evt.target.value,
                  }, () => this.updateTotal());
                }
              }}
              onClick={(event) => { event.target.setSelectionRange(0, event.target.value.length); }}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowInfoText && <div className="cryptoCurrency">{infoText}</div>
        }
      </div>
    );
  }

  renderForm() {
    const {
      total, isShowOdds, marketOdds, isChangeOdds, buttonClass, disable,
    } = this.state;
    const { amount } = this.props;
    const { winValue } = this.state;
    console.log('Win Value:', winValue);

    const oddsField = {
      id: 'odds',
      name: 'odds',
      label: 'Odds',
      className: `odds${isChangeOdds ? ' yourOdds' : ''}`,
      placeholder: '2.0',
      value: 3.0,
      defaultValue: marketOdds,
      infoText: isChangeOdds ? 'Your Odds' : 'Market Odds',
      isShowInfoText: true,
      type: 'text',
    };

    return (
      <form className="wrapperBettingShakeFree" onSubmit={this.onSubmit}>
        <p className="titleForm text-center">BET FREE ON THE OUTCOME</p>
        {<Toggle ref={(component) => { this.toggleRef = component; }} onChange={this.onToggleChange} />}
        {/* this.renderInputField(amountField) */}
        <div className="freeAmount">You have {amount} ETH FREE to bet!</div>
        {isShowOdds && this.renderInputField(oddsField)}
        <div className="rowWrapper">
          <div>Possible winnings</div>
          <div className="possibleWinningsValue">{winValue}</div>
        </div>
        <Button type="submit" disabled={disable} block className={buttonClass}>
          Go
        </Button>
      </form>
    );
  }


  render() {
    return this.renderForm();
  }
}
const mapDispatch = ({
  initFreeHandshake,
  shakeItem,
  showAlert,
});
export default connect(null, mapDispatch)(BetingShakeFree);
