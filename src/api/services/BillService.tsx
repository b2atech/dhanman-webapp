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
  getAddress = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Bill/GetAllBillDetail/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAddress.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getBillAddCustomer = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Vendor/GetAllVendors/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getBillAddCustomer.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getIvoiceAddCustomer = async function (clientId: string, cancel = false) {
    const response = await api.request({
      url: `/Vendor/GetAllVendors/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getIvoiceAddCustomer.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

const cancelApiObject = defineCancelApiObject(BillAPI);
