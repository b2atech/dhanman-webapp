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
  poNo: string | number;
  poDate: Date | string;
  fess: number;
  discount: number;
  taxableAmount: number;
  cgstTaxAmount: number;
  sgstTaxAmount: number;
  igstTaxAmount: number;
  totalAmount: number;
}

export interface IBill {
  id: number;
  billNumber: string;
  bill_id: number;
  vendor_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  billStatusId: number;
  billStatus: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
  totalAmount: number;
  setteledAmount: number;
  payingAmount: number;
}

export interface IBillType {
  id: number;
  billPaymentId: number;
  billNumber: number;
  billDate: Date | string | number;
  dueDate: Date | string;
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
    tax: number | null;
    gstIn: string | null;
  };
  currency: string;
  totalAmount: number;
  tax: number;
  discount: number | null;
  note: string;
  lines: Items[];
}

export interface ICompanyInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: number;
  addressLine: string;
  gstIn: string | null;
  description: string;
}

export interface IBillStatus {
  status: number;
  statusName: string;
  nextStatus: number;
  nextStatusName: string;
  previousStatus: number;
  previousStatusName: string;
  isInitial: boolean;
}

export interface IUpdateBillNextStatus {
  billIds: string[];
  companyId: string;
}

export interface IUpdateBillPreviousStatus {
  billIds: string[];
  companyId: string;
}
