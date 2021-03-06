import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { URL } from '@/constants';
import { clearHeaderBack } from '@/reducers/app/action';

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPath: this.props.location.pathname,
      isNotFound: this.props.app.isNotFound
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.pathname !== prevState.currentPath) {
      return { currentPath: nextProps.location.pathname };
    }
    if (nextProps.app.isNotFound !== prevState.isNotFound) {
      return { isNotFound: nextProps.app.isNotFound };
    }
    return null;
  }


  checkSelected(URLs) {
    let _URLs = URLs;
    if (!Array.isArray(URLs)) { _URLs = [URLs]; }
    return (_URLs.indexOf(this.state.currentPath) >= 0 && !this.state.isNotFound) && 'selected';
  }

  modeIcon(URLs) {
    const selected = this.checkSelected(URLs);
    return selected ? 'fas' : 'fal';
  }

  render() {
    return (
      <footer className="footer">
        <ul>
          <li className={cn(this.checkSelected(URL.PREDICTION))}>
            <Link to={URL.PREDICTION} onClick={this.props.clearHeaderBack}>
              <span className={cn(this.modeIcon(URL.PREDICTION), 'fa-list-alt')} />
              <span className="TextIcon">FEED</span>
            </Link>
          </li>
          {/* <li className={cn(this.checkSelected(URL.HANDSHAKE_WALLET_INDEX))}>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <span className={cn(this.modeIcon(URL.HANDSHAKE_WALLET_INDEX), 'fa-wallet')} />
              <span className="TextIcon">{this.props.intl.messages.app.navigation.wallet.toUpperCase()}</span>
            </Link>
          </li> */}
          <li className={cn(this.checkSelected(URL.CREATE_EVENT), 'PlusButton')}>
            <Link to={URL.CREATE_EVENT} className="CreateEvent">
              <span className="fal fa-plus" />
            </Link>
          </li>
          <li className={cn(this.checkSelected([URL.HANDSHAKE_ME_INDEX]))}>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <span className={cn(this.modeIcon([URL.HANDSHAKE_ME_INDEX]), 'fa-user')} />
              <span className="TextIcon">ME</span>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default connect(
  state => ({ app: state.app, location: state.router.location }),
  { clearHeaderBack }
)(Navigation);
