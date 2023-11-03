import { apiCommon } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const CommonAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiCommon.request({
        url: `/Vendor/GetAllVendors/${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllChartOfAccount = async function (clientId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/GetAllCOAs/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllChartOfAccount.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllRootChartOfAccount = async function (clientId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/GetAllRootCOAs/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllRootChartOfAccount.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  GetCOAOrder = async function (clientId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/GetCOAOrder/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[GetCOAOrder.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  };

const cancelApiObject = defineCancelApiObject(CommonAPI);
