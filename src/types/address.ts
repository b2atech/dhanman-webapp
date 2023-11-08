export interface ICountry {
  id: string;
  name: string;
  isoAlphaCode: string;
}

export interface IState {
  id: string;
  name: string;
  countryId: string;
}

export interface ICity {
  id: string;
  name: string;
  postalCode: string;
  stateId: string;
  
export interface IAddress {
  country: string;
  state: string;
  city: string;
  pinCode: string;
}
