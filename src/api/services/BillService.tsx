import { api } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const BillAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await api.request({
        url: `/Vendor/GetAllVendors/${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllBillDetail = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Bill/GetAllBillDetail/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllBillDetail.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getAllVendors = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Vendor/GetAllVendors/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllVendors.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getAllBillHeaders = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Bill/GetAllBillHeader/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllBillHeaders.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

const cancelApiObject = defineCancelApiObject(BillAPI);
