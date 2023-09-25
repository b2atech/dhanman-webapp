// ==============================|| INVOICE - SLICE ||============================== //

export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CountryType {
  code: string;
  label: string;
  currency: string;
  prefix: string;
}

export interface Items {
  id: string | number;
  name: string;
  description: string;
  qty: number;
  price: string | number;
}

export interface InvoiceProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  lists: IInvoice[];
  list: IInvoice | null;
  error: object | string | null;
  alertPopup: boolean;
}

export interface IInvoice {
  id: number;
  invoice_id: number;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  status: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
}

export interface InvoiceDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}

export interface ICustomer {
  clientId: string;
  vendorId: number;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
}

export interface IGetCustomerResponse {
  data: {
    vendrors: ICustomer[];
  };
}
