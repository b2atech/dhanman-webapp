export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceHeader {
  // invoiceNumber: string;
  // invoiceDate: Date | string | number;
  // dueDate: Date | string | number;
  // tax: number | null;
  // discount: number | null;
  // id: number;
  // quantity: number;
  // customer_name: string;
  // email: string;
  // avatar: number;
  // lines?: InvoiceLine[];
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
  billStatusId: string;
  vendorId: string;
  coaId: string;
  billPaymentId: string | null;
  customer_name: string;
  email: string;
  avatar: number;
  status: string;
  lines?: InvoiceLine[];
  cashierInfo: InfoType;
  customerInfo: InfoType;
}

export interface InvoiceLine {
  name: string;
  description: string;
  price: string | number;
  quantity: number;
  amount: string | number;
}
