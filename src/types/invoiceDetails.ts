export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceHeader {
  invoiceNumber: string;
  invoiceDate: Date | string | number;
  dueDate: Date | string | number;
  tax: number | null;
  discount: number | null;
  id: number;
  quantity: number;
  customer_name: string;
  email: string;
  avatar: number;
  lines?: InvoiceLine[];
}

export interface InvoiceEdit {
  invoiceNumber: string;
  invoiceHeaederId: string;
  customerId: string;
  invoiceDate: Date | string | number;
  dueDate: Date | string | number;
  totalAmount: number | null;
  currency: string;
  tax: number | null;
  discount: number | null;
  note: string;
  lines?: InvoiceLine[];
}

export interface InvoiceHeader_main {
  invoiceDetails: any;
  invoiceNumber: string;
  invoiceVoucher: string;
  invoiceDate: Date | string | number;
  paymentTerm: number;
  customerId: string;
  dueDate: Date | string | number;
  totalAmount: number;
  currency: string;
  tax: number | null;
  discount: number | null;
  note: String;
  clientId: string;
  id: number;
  quantity: number;
  coaId: string;
  billPaymentId: string | null;
  invoiceStatusId: string | null;
  customer_name: string;
  email: string;
  avatar: number;
  status: string;
  lines?: InvoiceLine[];
  cashierInfo: InfoType;
  customerInfo: InfoType;
}

export interface InvoicePaymentHeader {
  id: string;
  customerId: string;
  companyId: string;
  customerName: string;
  invoiceDate: Date | string | number;
  dueDate: Date | string | number;
  amount: number;
  receivingAmount: number;
  paymentMode: string | number;
  paymentThrough: string | number;
  description: string;
  lines?: IInvoicePaymentLine[];
}

export interface IInvoicePaymentLine {
  id: string;
  invoicePaymentId: string;
  invoicelNumber: string;
  invoiceDate: Date | string | number;
  dueDate: Date | string | number;
  status: String;
  invoiceAmount: number;
  setteledAmount: number;
  remainingAmount: number;
  receivingAmount: number;
  invoiceStatusId: string;
  invoiceStatus: string;
}

export interface InvoiceLine {
  id: string | number;
  name: string;
  description: string;
  price: string | number;
  quantity: number;
  amount: string | number;
}
