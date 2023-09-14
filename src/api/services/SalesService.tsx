import { apiSales } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { InvoiceHeader } from 'types/invoiceDetails';

export const InvoiceAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiSales.request({
        url: `//${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });
      return response.data;
    }
  },
  getAllCustomers = async function (clientId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/GetAllcustomers/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCustomers.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  createInvoiceRequest = async function (invoicedata: InvoiceHeader) {
    const response = await apiSales.request({
      url: `v1/invoice`,
      method: 'POST',
      data: invoicedata
    });
    return response.data;
  };

const cancelApiObject = defineCancelApiObject(InvoiceAPI);
