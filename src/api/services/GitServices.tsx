import { apiGit } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

const token = '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';

export const GitAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiGit.request({
        url: `//${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });
      return response.data;
    }
  },
  getAllPRs = async function (repo: string, cancel = false) {
    const response = await apiGit.request({
      url: `${repo}/pulls/`,
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Credentials': true
      },
      signal: cancel ? cancelApiObject[getAllPRs.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

const cancelApiObject = defineCancelApiObject(GitAPI);
