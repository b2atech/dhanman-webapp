import { apiSales } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';
import { InvoiceHeader } from 'types/invoiceDetails';

export const InvoiceAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiSales.request({
        url: `v1/GetAllcustomers?clientId=3fa85f64-5717-4562-b3fc-2c963f66afa6`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  createInvoiceRequest = async function (invoicedata: InvoiceHeader) {
    const response = await apiSales.request({
      url: `/v1/invoice`,
      method: 'POST',
      data: invoicedata
    });
    return response.data;
  };

const cancelApiObject = defineCancelApiObject(InvoiceAPI);
