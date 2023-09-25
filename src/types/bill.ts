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

export interface Items {
  id: string | number;
  name: string;
  description: string;
  qty: number;
  price: string | number;
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
  status: string;
  invoice_detail: Items[];
  cashierInfo: InfoType;
  discount: number | null;
  tax: number | null;
  customerInfo: InfoType;
  notes: string;
}
