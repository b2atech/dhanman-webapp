import { apiPurchase } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { BillHeader } from 'types/billiingDetails';
import { VendorData } from 'types/customerinfo';

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
  },
  deleteVendorRequest = async function (id: string) {
    try {
      const response = await apiPurchase.request({
        url: `v1/vendor/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
  updateVendorRequest = async function (vendorData: VendorData) {
    try {
      const response = await apiPurchase.request({
        url: `v1/vendor`,
        method: 'PUT',
        data: vendorData
      });
      return response.status;
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  },
  deleteBillRequest = async function (id: string) {
    try {
      const response = await apiPurchase.request({
        url: `v1/bill/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
  getBillById = async function (id: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/GetBill/${id}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getBillById.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

export async function createBillRequest(billdata: BillHeader) {
  const response = await apiPurchase.request({
    url: `v1/bill/`,
    method: 'POST',
    data: billdata
  });
  return response.data;
}
export async function createVendorRequest(vendordata: VendorData) {
  const response = await apiPurchase.request({
    url: `v1/vendors`,
    method: 'POST',
    data: vendordata
  });
  return response.status;
}

const cancelApiObject = defineCancelApiObject(BillAPI);
