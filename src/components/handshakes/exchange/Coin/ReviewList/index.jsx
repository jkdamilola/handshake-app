/* eslint react/sort-comp:0 */
/* eslint camelcase: 0 */

import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import './ReviewList.scss';
import { getReviewBuyCoin } from '@/reducers/exchange/action';
import { Grid, Row } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image/Image';
import loadingSVG from '@/assets/images/icon/user_icon.svg';
import debounce from "@/utils/debounce";


class ReviewList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFinished: false,
      page: null,
    };

    this.autoLoadMore = debounce(:: this.autoLoadMore, 1000);
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  componentDidMount() {
    this.getReviewCoin();
  }

  componentWillUnmount() {
  }

  getReviewCoin = () => {
    const { isFinished, page } = this.state;
    if (isFinished) {
      return;
    }

    const qs = { };
    if (page) {
      qs.page = page;
    }

    this.props.getReviewBuyCoin({
      PATH_URL: `${API_URL.INTERNAL.REVIEW_COIN_ORDER}`,
      qs,
      METHOD: 'GET',
      successFn: this.onSuccess,
      // errorFn: this.handleReviewOfferFailed,
    });
  }

  onSuccess = (res) => {
    console.log('onSuccess', res);
    if (res?.can_move === false) {
      this.setState({ isFinished: true });
    } else {
      this.setState({ page: res?.page }, this.autoLoadMore);
    }
  }

  autoLoadMore = (e) => {
    e.preventDefault();
    this.getReviewCoin();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
  }

  resetState = () => {
    const state = {
      isFinished: false,
      page: null,
    };
    this.setState(state);
  }

  render() {
    console.log('render ReviewList', this.props.reviewList);
    const { isFinished } = this.state;
    const { reviewList, numReview } = this.props;
    const { messages } = this.props.intl;
    return (
      <div className="review-list-container">
        <span className="review-list-count-comment">{numReview} {messages.review.label.comments}</span>
        <Grid className="review-list">
          {
            reviewList && reviewList.map(item => {
              return (
                <Row key={item?.id} className="review">
                  <div><Image src={loadingSVG} alt="loading" width="30" /></div>
                  <div className="review-content">
                    <div className="name">{item?.name}</div>
                    <div className="content">{item?.review}</div>
                  </div>
                </Row>);
            })
          }
        </Grid>
        { !isFinished &&
          <button onClick={this.autoLoadMore}>{messages.review.label.loadMore}</button>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  reviewList: state.exchange.reviewList,
  numReview: state.exchange.numReview,
});

const mapDispatchToProps = (dispatch) => ({
  getReviewBuyCoin: bindActionCreators(getReviewBuyCoin, dispatch),
});

export default withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReviewList)));
