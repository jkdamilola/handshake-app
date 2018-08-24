import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/stores/api-saga';
import { API_URL, URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { handleLoadMatches } from '@/pages/Prediction/saga';
import { isBalanceValid } from '@/stores/common-saga';
import { showAlert } from '@/stores/common-action';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { reportSelector } from './selector';
import { loadCreateEventData, createEvent, shareEvent, sendEmailCode, verifyEmail, updateEmailPut, updateCreateEventLoading } from './action';

function* handleLoadReportsSaga({ cache = true }) {
  try {
    if (cache) {
      const events = yield select(reportSelector);
      if (events && events.length) {
        return events;
      }
    }
    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_REPORTS,
      type: 'LOAD_REPORTS',
      _path: 'reports',
    });
  } catch (e) {
    return console.error('handleLoadReportsSaga', e);
  }
}

function* handleLoadCategories() {
  try {
    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_CATEGORIES,
      type: 'LOAD_CATEGORIES',
      _path: 'categories',
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

function* handleLoadCreateEventData() {
  try {
    yield put(updateCreateEventLoading(true));
    yield all([
      call(handleLoadReportsSaga, {}),
      call(handleLoadMatches, {}),
      call(handleLoadCategories, {}),
    ]);
    yield put(updateCreateEventLoading(false));
  } catch (e) {
    console.error(e);
  }
}

function* handleAddOutcomesSaga({ eventId, newOutcomeList, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_OUTCOME}\\${eventId}`,
      type: 'ADD_OUTCOMES_API', // @TODO: review name
      data: newOutcomeList,
      ...payload,
    });
  } catch (e) {
    console.error('handleAddOutcomesSaga', e);
    return null;
  }
}

function* handleCreateNewEventSaga({ newEventData }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_MATCH}`,
      type: 'ADD_EVENT_API',
      data: [newEventData],
    });
  } catch (e) {
    return console.error(e);
  }
}

function* handleGenerateShareLinkSaga({ outcomeId, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.GENERATE_LINK}`,
      type: 'GENERATE_SHARE_LINK',
      data: {
        outcome_id: outcomeId,
      },
      ...payload,
    });
  } catch (e) {
    return console.error('handleGenerateShareLinkSaga', e);
  }
}

function* saveGenerateShareLinkToStore(data) {
  const { outcomeId, eventName } = data;
  const generateLink = yield call(handleGenerateShareLinkSaga, { outcomeId });
  return yield put(shareEvent({
    url: `${window.location.origin}${URL.HANDSHAKE_PREDICTION}${generateLink.data.slug_short}`,
    name: eventName,
  }));
}

function* handleCreateEventSaga({ values, isNew, selectedSource }) {
  try {
    yield put(updateCreateEventLoading(true));
    const balanceValid = yield call(isBalanceValid);
    if (!balanceValid) {
      yield put(showAlert({
        message: MESSAGE.NOT_ENOUGH_GAS,
      }));
    } else {
      const betHandshakeHandler = BetHandshakeHandler.getShareManager();
      if (!isNew) {
        // Add new outcomes
        const newOutcomeList = values.outcomes.filter(o => !o.id).map(i => Object.assign({}, i, { public: 0 }));
        const { eventId } = values;
        const addOutcomeResult = yield call(handleAddOutcomesSaga, {
          eventId,
          newOutcomeList,
        });
        if (!addOutcomeResult.error) {
          const inputData = addOutcomeResult.data.map(o => {
            return {
              fee: values.creatorFee,
              source: `${values.reports || '-'}`,
              closingTime: values.closingTime,
              reportTime: values.reportingTime,
              disputeTime: values.disputeTime,
              offchain: o.id,
              contractAddress: o.contract.contract_address,
              contractName: o.contract.json_name,
            };
          });
          const outcomeId = addOutcomeResult.data[0].id;
          const eventName = addOutcomeResult.data[0].name;
          yield saveGenerateShareLinkToStore({ outcomeId, eventName });
          betHandshakeHandler.createNewEvent(inputData);
        }
      } else {
        // Create new event
        const reportSource = {
          source_id: selectedSource,
          source: selectedSource ? undefined : {
            name: values.ownReportName,
            url: values.ownReportUrl,
          },
        };
        Object.keys(reportSource).forEach((k) => !reportSource[k] && delete reportSource[k]);
        const newEventData = {
          homeTeamName: values.homeTeamName || '',
          awayTeamName: values.awayTeamName || '',
          homeTeamCode: values.homeTeamCode || '',
          awayTeamCode: values.awayTeamCode || '',
          homeTeamFlag: values.homeTeamFlag || '',
          awayTeamFlag: values.awayTeamFlag || '',
          name: values.eventName,
          date: values.closingTime,
          reportTime: values.reportingTime,
          disputeTime: values.disputeTime,
          market_fee: values.creatorFee,
          outcomes: values.outcomes,
          category_id: values.category,
          ...reportSource,
        };
        const { data } = yield call(handleCreateNewEventSaga, { newEventData });
        if (data && data.length) {
          const eventData = data[0];
          const { contract } = eventData;
          console.log('Contract:', contract);
          const inputData = eventData.outcomes.map(o => {
            return {
              fee: eventData.market_fee,
              source: eventData.source_name,
              closingTime: eventData.date,
              reportTime: eventData.reportTime,
              disputeTime: eventData.disputeTime,
              offchain: o.id,
              contractAddress: contract.contract_address,
              contractName: contract.json_name,
            };
          });
          const outcomeId = eventData.outcomes[0].id;
          const eventName = eventData.name;
          yield saveGenerateShareLinkToStore({ outcomeId, eventName });
          betHandshakeHandler.createNewEvent(inputData);
        }
      }
    }
  } catch (e) {
    console.error('handleCreateNewEventSaga', e);
  } finally {
    yield put(updateCreateEventLoading(false));
  }
}

function* handleUpdateEmail({ email }) {
  try {
    const userProfile = new FormData();
    userProfile.set('email', email);
    const responded = yield call(apiPost, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'UPDATE_EMAIL_FETCH',
      data: userProfile,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return yield put(updateEmailPut(responded.data.email));
  } catch (e) {
    console.error('handleUpdateEmail', e);
    return null;
  }
}

function* handleSendEmailCode({ email }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `user/verification/email/start?email=${email}`,
      type: 'SEND_EMAIL_CODE',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (e) {
    console.error('handleSendEmailCode', e);
    return null;
  }
}

function* handleVerifyEmail({ email, code }) {
  try {
    yield call(apiPost, {
      PATH_URL: `user/verification/email/check?email=${email}&code=${code}`,
      type: 'VERIFY_EMAIL',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    yield handleUpdateEmail({ email });
  } catch (e) {
    console.error('handleVerifyEmail', e);
  }
}

export default function* createMarketSaga() {
  yield takeLatest(loadCreateEventData().type, handleLoadCreateEventData);
  yield takeLatest(createEvent().type, handleCreateEventSaga);
  yield takeLatest(sendEmailCode().type, handleSendEmailCode);
  yield takeLatest(verifyEmail().type, handleVerifyEmail);
}