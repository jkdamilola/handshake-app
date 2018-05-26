import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import DynamicImport from '@/components/App/DynamicImport';
import Loading from '@/pages/Loading';
import { URL } from '@/config';
import { setHeaderTitle } from '@/reducers/app/action';

const Discover = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover/Discover')}>{Component => <Component {...props} />}</DynamicImport>);
const DiscoverDetail = props => (<DynamicImport loading={Loading} load={() => import('@/pages/Discover/Detail')}>{Component => <Component {...props} />}</DynamicImport>);
const Page404 = props => (<DynamicImport isNotFound loading={Loading} load={() => import('@/pages/Error/Page404')}>{Component => <Component {...props} />}</DynamicImport>);

const routerMap = [
  { path: URL.HANDSHAKE_DISCOVER_INDEX, component: Discover },
  { path: URL.HANDSHAKE_DISCOVER_DETAIL, component: DiscoverDetail },
];

class DiscoverRouter extends React.Component {
  static propTypes = {
    setHeaderTitle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.setHeaderTitle('Discover');
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

export default connect(null, ({ setHeaderTitle }))(DiscoverRouter);
