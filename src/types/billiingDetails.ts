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
  quantity: number;
  price: string | number;
  amount: string | number;
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
  id: number;
  billing_id: number;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  status: string;
  billDetails: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
}

export interface billingeDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}
