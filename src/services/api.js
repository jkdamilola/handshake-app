import axios from 'axios';
import qs from 'qs';
import { isEmpty, merge } from 'lodash';
import local from '@/services/localStore';
import { APP, BASE_API } from '@/constants';
import { MasterWallet } from '@/models/MasterWallet';

const $http = (url, data, id, qsObject, headersMore, method = 'GET') => {
  let QS = '';

  if (!isEmpty(qsObject)) {
    QS = qs.stringify(qsObject);
  }

  const token = local.get(APP.AUTH_TOKEN);
  const wallet = MasterWallet.getWalletDefault('ETH');

  let headers = {
    // 'Content-Type': 'application/json',
  };

  if (!isEmpty(headersMore)) {
    headers = merge(headers, headersMore);
  }

  if (token) {
    headers.Payload = token;
  }

  if (wallet && wallet.chainId) {
    headers.ChainId = wallet.chainId;
  }

  const profile = local.get(APP.AUTH_PROFILE);

  if (profile && profile.fcm_token) {
    headers['Fcm-Token'] = profile.fcm_token;
  }

  return axios.create({
    timeout: BASE_API.TIMEOUT,
    // withCredentials: true,
    headers,
  })[method.toLocaleLowerCase()](`${url}${id ? `${id}/` : ''}${QS ? `?${QS}` : ''}`, data);
};

export default $http;
