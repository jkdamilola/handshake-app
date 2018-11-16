import React from 'react';
import PropTypes from 'prop-types';

const BetParams = ({ possibleWinning, gasPrice, marketFee, ...restProps }) => {
  return (
    <div {...restProps}>
      <div className="Item">
        <span className="Label">Possible winning</span>
        <span className="value">{possibleWinning}</span>
      </div>
      <div className="Item">
        <span className="Label">Gas price</span>
        <span className="value">{gasPrice}</span>
      </div>
      <div className="Item">
        <span className="Label">Market fee</span>
        <span className="value">{marketFee}</span>
      </div>
    </div>
  );
};

BetParams.propTypes = {
  possibleWinning: PropTypes.string.isRequired,
  gasPrice: PropTypes.string.isRequired,
  marketFee: PropTypes.string.isRequired
};

export default BetParams;