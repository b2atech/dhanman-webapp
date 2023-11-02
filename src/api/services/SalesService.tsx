import { CustomerInfo } from 'types/customerinfo';
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
  getAllInvoices = async function (clientId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/GetAllInvoices/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllInvoices.name].handleRequestCancellation().signal : undefined
    });
    return response.data.items;
  },
  getInvoiceDetailsByHeaderId = async function (id: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/invoiceDetailByHeaderId/${id}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getInvoiceDetailsByHeaderId.name].handleRequestCancellation().signal : undefined
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
  },
  createCustomerRequest = async function (customerdata: CustomerInfo) {
    const response = await apiSales.request({
      url: `v1/customers`,
      method: 'POST',
      data: customerdata
    });
    return response.data;
  },
  deleteCustomerRequest = async function (id: string) {
    try {
      const response = await apiSales.request({
        url: `v1/customer/${id}`, // Include the vendor ID in the URL
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      // Handle any errors that may occur during the request
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },
  getAllPRs = async function (repo: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/GetAllPRs/${repo}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllPRs.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getInvoice = async function (headerId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/GetInvoice/${headerId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllInvoices.name].handleRequestCancellation().signal : undefined
    });
    return response.data;
  };

const cancelApiObject = defineCancelApiObject(InvoiceAPI);
