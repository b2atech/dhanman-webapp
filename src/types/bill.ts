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
