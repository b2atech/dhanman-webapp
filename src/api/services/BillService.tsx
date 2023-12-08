import { PaidPaymentData } from 'types/bill';
import { apiPurchase } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { BillEdit, BillHeader } from 'types/billiingDetails';
import { VendorData } from 'types/customerinfo';

export const BillAPI = {
    get: async function (companyId: string, cancel = false) {
      const response = await apiPurchase.request({
        url: `v1/vendors/${companyId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllVendors = async function (companyId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/vendors/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllVendors.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllBills = async function (companyId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/bills/${companyId}`,
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
      url: `v1/bill/${id}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getBillById.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  },
  getBillDefaultStatus = async function (id: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/billDefaultStatus/${id}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getBillDefaultStatus.name].handleRequestCancellation().signal : undefined
    });
    return response.data;
  },
  createBillRequest = async function (billdata: BillHeader) {
    const response = await apiPurchase.request({
      url: `v1/bill`,
      method: 'POST',
      data: billdata
    });
    return response.data;
  },
  createVendorRequest = async function (vendordata: VendorData) {
    const response = await apiPurchase.request({
      url: `v1/vendor`,
      method: 'POST',
      data: vendordata
    });
    return response.status;
  },
  getAllPaidPayments = async function (companyId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `v1/paidPayments/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllPaidPayments.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  deletepaidPaymentRequest = async function (id: string) {
    try {
      const response = await apiPurchase.request({
        url: `/v1/paidPayment/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting paid payment:', error);
      throw error;
    }
  },
  createPaidPaymentRequest = async function (piadPaymentData: PaidPaymentData) {
    const response = await apiPurchase.request({
      url: `v1/paidPayment`,
      method: 'POST',
      data: piadPaymentData
    });
    return response.status;
  },
  updateBillRequest = async function (billEdit: BillEdit) {
    const response = await apiPurchase.request({
      url: `v1/bill/`,
      method: 'PUT',
      data: billEdit
    });
    return response.data;
  };

const cancelApiObject = defineCancelApiObject(BillAPI);
