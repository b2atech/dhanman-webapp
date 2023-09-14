import { InvoiceHeader_main } from 'types/invoiceDetails';
import { apiPurchase, apiSales } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { BillingList } from 'types/billiingDetails';

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
      url: `v1/GetAllvendors/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllVendors.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllBillHeaders = async function (clientId: string, cancel = false) {
    const response = await apiPurchase.request({
      url: `/Bill/GetAllBillHeader/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllBillHeaders.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

export async function createInvoiceRequest(invoice: BillingList) {
  const response = await apiPurchase.request({
    url: `/Bill/CreateBill`,
    method: 'POST',
    data: invoice
  });
  return response.data;
}

export async function createInvoiceRequest1(invoice1: InvoiceHeader_main) {
  const response = await apiSales.request({
    url: `/v1/invoice/`,
    method: 'POST',
    data: invoice1
  });
  return response.data;
}

const cancelApiObject = defineCancelApiObject(BillAPI);
