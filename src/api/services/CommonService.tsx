import { apiCommon } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const CommonAPI = {
    get: async function (companyId: string, cancel = false) {
      const response = await apiCommon.request({
        url: `v1/COAs/${companyId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllChartOfAccount = async function (companyId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/COAs/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllChartOfAccount.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllRootChartOfAccount = async function (companyId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/rootCOAs/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllRootChartOfAccount.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  GetCOAOrder = async function (companyId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/cOAsOrder/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[GetCOAOrder.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllCountries = async function (cancel = false) {
    const response = await apiCommon.request({
      url: `v1/countries`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCountries.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllCities = async function (stateId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/cities/${stateId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCities.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllStates = async function (countryId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/states/${countryId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllStates.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  GetAllAddress = async function (cityId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/addresses/${cityId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[GetAllAddress.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getAllAccountGroups = async function (companyId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/accountGroups/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllAccountGroups.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getCompanyDetail = async function (companyId: string, cancel = false) {
    const response = await apiCommon.request({
      url: `v1/company/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getCompanyDetail.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getAllCompanies = async function (cancel = false) {
    const response = await apiCommon.request({
      url: `v1/companies`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCompanies.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  };

const cancelApiObject = defineCancelApiObject(CommonAPI);
