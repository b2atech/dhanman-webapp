import { ReceivedPaymentData } from 'types/invoice';
import { CustomerData } from 'types/customerinfo';
import { apiSales } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { InvoiceEdit, InvoiceHeader } from 'types/invoiceDetails';
import { IUpdateInvoiceStatus } from 'types/invoice';

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
  getAllCustomers = async function (companyId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/customers/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCustomers.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllInvoices = async function (companyId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/invoices/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllInvoices.name].handleRequestCancellation().signal : undefined
    });
    return response.data.items;
  },
  getAllReceivedPayments = async function (companyId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/invoicePayments//${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllReceivedPayments.name].handleRequestCancellation().signal : undefined
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
  updateInvoiceRequest = async function (invoicedata: InvoiceEdit) {
    const response = await apiSales.request({
      url: `v1/invoice`,
      method: 'PUT',
      data: invoicedata
    });
    return response.status;
  },
  createCustomerRequest = async function (customerData: CustomerData) {
    const response = await apiSales.request({
      url: `v1/customer`,
      method: 'POST',
      data: customerData
    });
    return response.status;
  },
  updateCustomerRequest = async function (customerData: CustomerData) {
    const response = await apiSales.request({
      url: `v1/customer`,
      method: 'PUT',
      data: customerData
    });
    return response.status;
  },
  deleteCustomerRequest = async function (id: string) {
    try {
      const response = await apiSales.request({
        url: `v1/customer/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
  deleteReceivedPaymentsRequest = async function (id: string) {
    try {
      const response = await apiSales.request({
        url: `v1/receivedPayment/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting received payments:', error);
      throw error;
    }
  },
  createReceivedPaymentRequest = async function (receivedPaymentData: ReceivedPaymentData) {
    const response = await apiSales.request({
      url: `v1/invoicePayments`,
      method: 'POST',
      data: receivedPaymentData
    });
    return response.status;
  },
  deleteInvoiceRequest = async function (id: string) {
    try {
      const response = await apiSales.request({
        url: `v1/invoice/${id}`,
        method: 'DELETE'
      });
      return response.data;
    } catch (error) {
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
      url: `v1/invoice/${headerId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllInvoices.name].handleRequestCancellation().signal : undefined
    });
    return response.data;
  },
  getAllStatus = async function (companyId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/invoiceStatusesByCompany/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllStatus.name].handleRequestCancellation().signal : undefined
    });
    return response.data.items;
  },
  getInvoiceDefaultStatus = async function (headerId: string, cancel = false) {
    const response = await apiSales.request({
      url: `v1/invoiceDefaultStatus/${headerId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getInvoiceDefaultStatus.name].handleRequestCancellation().signal : undefined
    });
    return response.data;
  },
  updateStatus = async function (updateInvoiceStatus: IUpdateInvoiceStatus) {
    const response = await apiSales.request({
      url: 'v1/invoiceStatuses',
      method: 'PUT',
      data: updateInvoiceStatus
    });
    return response.data;
  };

const cancelApiObject = defineCancelApiObject(InvoiceAPI);
