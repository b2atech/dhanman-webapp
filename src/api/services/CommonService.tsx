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
  },
  getAllCountries = async function (cancel = false) {
    const response = await apiCommon.request({
      url: `v1/getAllCountries/`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCountries.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllCities = async function (clientId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/getAllCities/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCities.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllStates = async function (clientId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/getAllStates/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllStates.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;

  GetAllAddress = async function (cityId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/getAllAddress/${cityId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[GetAllAddress.name].handleRequestCancellation().signal : undefined
    });

    return response.data;

  };

const cancelApiObject = defineCancelApiObject(CommonAPI);
