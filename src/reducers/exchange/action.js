// import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const EXCHANGE_ACTIONS = {
  GET_CRYPTO_PRICE: 'GET_CRYPTO_PRICE',

  CREATE_CC_ORDER: 'CREATE_CC_ORDER',

  GET_USER_CC_LIMIT: 'GET_USER_CC_LIMIT',

  GET_CC_LIMITS: 'GET_CC_LIMITS',

  GET_USER_PROFILE: 'GET_USER_PROFILE',

  GET_OFFER_PRICE: 'GET_OFFER_PRICE',

  GET_USER_TRANSACTION: 'GET_USER_TRANSACTION',

  CREATE_OFFER: 'CREATE_OFFER',
  GET_LIST_OFFERS: 'GET_LIST_OFFERS',
  GET_OFFER: 'GET_OFFER',
  CLOSE_OFFER: 'CLOSE_OFFER',
  SHAKE_OFFER: 'SHAKE_OFFER',
  COMPLETE_SHAKE_OFFER: 'COMPLETE_SHAKE_OFFER',
  CANCEL_SHAKE_OFFER: 'CANCEL_SHAKE_OFFER',
};

export const getCryptoPrice = createAPI(
  EXCHANGE_ACTIONS.GET_CRYPTO_PRICE
);

export const createCCOrder = createAPI(
  EXCHANGE_ACTIONS.CREATE_CC_ORDER,
);

export const getUserCcLimit = createAPI(
  EXCHANGE_ACTIONS.GET_USER_CC_LIMIT,
);

export const getCcLimits = createAPI(
  EXCHANGE_ACTIONS.GET_CC_LIMITS
);

export const getUserProfile = createAPI(
  EXCHANGE_ACTIONS.GET_USER_PROFILE
);

export const getOfferPrice = createAPI(
  EXCHANGE_ACTIONS.GET_OFFER_PRICE
);

export const getUserTransaction = createAPI(
  EXCHANGE_ACTIONS.GET_USER_TRANSACTION
);

export const createOffer = createAPI(
  EXCHANGE_ACTIONS.CREATE_OFFER
);

export const getListOffers = createAPI(
  EXCHANGE_ACTIONS.GET_LIST_OFFERS
)

export const getOffer = createAPI(
  EXCHANGE_ACTIONS.GET_OFFER
)

export const shakeOffer = createAPI(
  EXCHANGE_ACTIONS.SHAKE_OFFER
);

export const closeOffer = createAPI(
  EXCHANGE_ACTIONS.CREATE_OFFER
);

export const completeShakedOffer = createAPI(
  EXCHANGE_ACTIONS.COMPLETE_SHAKE_OFFER
);

export const cancelShakedOffer = createAPI(
  EXCHANGE_ACTIONS.CANCEL_SHAKE_OFFER
);



