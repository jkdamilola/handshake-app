import React from 'react';
import { connect } from 'react-redux';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import validator from './validator';
import './styles.scss';
import { getBankInfo, selectAccountId } from '@/reducers/sellCoin/action';

class AccountNameComponent extends React.Component {
  render() {
    const { accountId, accountName } = this.props;
    if (accountId && !accountName) {
        this.props.getBankInfo(accountId);
        return <div>Loading....</div>
    }
    return (
        <input type='text' placeholder='Ten Tai Khoan' disabled={!accountName} value={accountName} />
    );
  }
}
const mapState = (state) => ({
  accountName: state.sellCoin && state.sellCoin.selectBank && state.sellCoin.selectBank.accountName ? state.sellCoin.selectBank.accountName : '',
  accountId: state.sellCoin && state.sellCoin.selectBank && state.sellCoin.selectBank.accountId ? state.sellCoin.selectBank.accountId : ''
})
const mapDispatch = { getBankInfo }
const AccountName = connect(mapState, mapDispatch)(AccountNameComponent);

const renderField = (field) => {
  const { input, meta, placeholder, listData } = field;
  const { onChange, onFocus, onBlur, value } = input;
  const { error, touched } = meta;
  const shouldShowError = !!(touched && error);
  const handleOnChange = (text) => {
    console.log('onchange account name', text);
    if (text.length === 12) {
        console.log('load account name', text);
        // getBankInfo()();
        selectAccountId(text);
    }
    onChange(text);
  }
  return (
    <div className="currency-input-field">
      <AutoCompleteInput
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        onFocus={onFocus}
        onBlur={onBlur}
        markError={shouldShowError}
        listData={listData}
      />
      {
        shouldShowError &&
        <span className="error">{meta.error}</span>
      }
      <AccountName />
    </div>
  );
};

export default renderField;
export const bankNameValidator = validator;
