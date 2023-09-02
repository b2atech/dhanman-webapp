export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface InvoiceHeader {
  quantity: number;
  invoiceNumber: number;
  invoiceDate: Date | string | number;
  paymentTerm: number;
  customerId: string;
  dueDate: Date | string | number;
  totalAmount: number;
  tax: number | null;
  discount: number | null;
  note: String;
  clientId: string;
  id: number;
  currency: string;
  billStatusId: number;
  vendorId: number;
  coaId: number;
  billPaymentId: number | null;
  customer_name: string;
  email: string;
  avatar: number;
  status: string;
  invoiceDetails?: InvoiceLine[];
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
