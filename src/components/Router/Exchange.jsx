import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/pages/Loading';
import { URL } from '@/config';
import { setHeaderTitle } from '@/reducers/app/action';

const Exchange = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Exchange/Exchange')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_EXCHANGE_INDEX, component: Exchange },
];

class ExchangeRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('Exchange');
  }

  render() {
    return (
      <Switch>
        {routerMap.map(route => <Route key={route.path} exact path={route.path} component={route.component} />)}
        <Page404 />
      </Switch>
    );
  }
}

export default connect(null, ({ setHeaderTitle }))(ExchangeRouter);
