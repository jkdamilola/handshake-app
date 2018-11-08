import { ACTIONS } from '@/reducers/auth/action';
import { createAPI } from '@/reducers/action';

export const verifyEmailCode = createAPI('API:VERIFY_EMAIL_CODE');

export const loadReports = (payload = {}) => {
  return {
    type: 'PEX:GET_REPORTS',
    payload
  };
};

export const updateReports = (payload = {}) => {
  return {
    type: 'PEX:UPDATE_REPORTS',
    payload
  };
}

export const createEvent = (payload = {}) => {
  return {
    type: 'PEX:CREATE_EVENT',
    ...payload
  };
};

export const sendEmailCode = (payload = {}) => {
  return {
    type: 'PEX:SEND_EMAIL_CODE',
    payload
  };
};

export const updateProfile = (payload) => {
  return {
    type: `${ACTIONS.AUTH_FETCH}_SUCCESS`,
    payload
  };
};

export const updateEmailProfile = (payload) => {
  return {
    type: 'PEX:UPDATE_EMAIL_PROFILE',
    payload
  };
};