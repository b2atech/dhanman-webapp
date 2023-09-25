import { apiPurchase } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { BillHeader } from 'types/billiingDetails';

export const BillAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiPurchase.request({
        url: `/Vendor/GetAllVendors/${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllBillDetail = async function (clientId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `/Bill/GetAllBillDetail/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllBillDetail.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getAllVendors = async function (clientId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/GetAllVendors/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllVendors.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllBills = async function (clientId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/GetAllBills/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllBills.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  };

export async function createBillRequest(billdata: BillHeader) {
  const response = await apiPurchase.request({
    url: `v1/bill/`,
    method: 'POST',
    data: billdata
  });
  return response.data;
}

const cancelApiObject = defineCancelApiObject(BillAPI);
