import { api } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const BillAPI = {
  get: async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Vendor/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  }
};

const cancelApiObject = defineCancelApiObject(BillAPI);
