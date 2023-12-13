// ==============================|| IBILL - SLICE ||============================== //

export interface IVendor {
  clientId: string;
  vendorId: number;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
}

export interface IGetVendorResponse {
  data: {
    vendrors: IVendor[];
  };
}

export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface IPaidPayment {
  clientId: string;
  vendorId: string;
  vendorName: string;
  transactionId: string;
  coaId: string;
  description: string;
  amount: string | number;
}

export interface PaidPaymentData {
  clientId: string;
  vendorId: string;
  vendorName: string;
  transactionId: string;
  coaId: string;
  description: string;
  amount: string | number;
}

export interface Items {
  id: string | number;
  name: string;
  description: string;
  quantity: number;
  price: string | number;
  amount: number;
}

export interface IBill {
  id: number;
  bill_id: number;
  vendor_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  billStatus: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
  amount: number;
}

export interface IBillType {
  id: number;
  billPaymentId: number;
  billNumber: number;
  billDate: Date | string | number;
  paymentTerm: number;
  billStatus: string;
  vendor: {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    addressLine: string;
    city: string;
    phoneNumber: number;
  };
  currency: string;
  dueDate: Date | string | number;
  totalAmount: number;
  tax: number;
  discount: number | null;
  note: string;
  lines: Items[];
}
