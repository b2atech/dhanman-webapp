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

export interface BillingLine {
  id: number;
  // clientId: string;
  createdBy: number;
  createdDate: any;
  lastModifiedBy: number;
  lastModifiedDate: any;
  isActive: any;
  billHeaderId: number;
  name: string;
  description: string;
  quantity: number;
  price: string | number;
  amount: string | number;
  coaId: number;
}

export interface BillingProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  lists: BillingList[];
  list: BillingList | null;
  error: object | string | null;
  alertPopup: boolean;
}

export interface BillingList {
  note: String;
  invoiceDate: Date | string | number;
  clientId: string;
  customerId: string;
  id: number;
  amount: number | null;
  currency: string;
  paymentTerm: number;
  billStatusId: number;
  vendorId: number;
  coaId: number;
  billPaymentId: number | null;
  invoiceNumber: number;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  dueDate: Date | string | number;
  quantity: number;
  status: string;
  billDetails?: BillingLine[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  // notes: string;
}

export interface billingeDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}
