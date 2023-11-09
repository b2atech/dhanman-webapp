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
  deleteInvoiceRequest = async function (id: string) {
    try {
      const response = await apiPurchase.request({
        url: `v1/vendor/${id}`, // Include the vendor ID in the URL
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error('Error deleting invoice:', error);
      throw error;
    }
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
