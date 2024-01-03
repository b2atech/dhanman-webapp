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

export interface IInvoiceList {
  id: number;
  invoice_id: number;
  invoice_number: number;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  invoiceStatusId: number;
  invoiceStatus: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
}

export interface IInvoiceType {
  id: string;
  invoice_id: number;
  customer_name: string;
  invoiceNumber: string;
  email: string;
  avatar: number;
  invoiceDate: Date | string;
  dueDate: Date | string;
  quantity: number;
  customer: {
    id: string | number;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    email: string;
    city: string;
    tax: number | null;
    addressLine: string | null;
    gstIn: string | null;
  };
  invoiceStatus: string;
  totalAmount: number;
  lines: InvoiceItem[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  note: string;
  currency: string;
  roundOff: number;
}

export interface Items {
  id: string | number;
  name: string;
  description: string;
  qty: number;
  price: string | number;
}

export interface InvoiceItem {
  id: string | number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
  soNo: string | number;
  soDate: Date | string;
  fees: number;
  discount: number;
  taxableAmount: number;
  sgstTaxAmount: number;
  cgstTaxAmount: number;
  igstTaxAmount: number;
  totalAmount: number;
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
  totalAmount: number;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
  amount: number;
  receivingAmount: number;
  setteledAmount: number;
}

export interface InvoiceDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}

export interface IReceivedPayment {
  id: string;
  companyId: string;
  customerId: number;
  customerName: string;
  transactionId: string;
  coaId: string;
  description: string;
  amount: number;
}

export interface ReceivedPaymentData {
  companyId: string;
  customerId: string;
  customerName: string;
  transactionId: string;
  coaId: string;
  description: string;
  amount: string | number;
}
export interface ICustomer {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
}

export interface IInventory {
  clientId: string;
  productName: string;
  unitId: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  description: string;
  hsnCode: string;
  sac: string;
  purchasePrice: number;
  sellingPrice: number;
  cgst: number;
  sgst: number;
  igst: number;
  openingStock: number;
  minimumStock: number;
  vendorId: string;
  vendorName: string;
}
export interface ICoa {
  clientId: string;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
  customerName: string;
}

export interface IGetCustomerResponse {
  data: {
    vendrors: ICustomer[];
  };
}

export interface ICompanyInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addressLine: string;
  gstIn: string;
  description: string;
}

export interface IStatus {
  id: string | number;
  companyId: string | number;
  status: number;
  statusName: string;
  nextStatus: number;
  nextStatusName: string;
  previousStatus: number;
  previousStatusName: string;
  isInitial: boolean;
}
export interface IUpdateInvoiceNextStatus {
  invoiceIds: string[];
  companyId: string;
}
export interface IUpdateInvoicePreviousStatus {
  invoiceIds: string[];
  companyId: string;
}
