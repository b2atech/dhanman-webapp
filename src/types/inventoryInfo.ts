/* eslint-disable prettier/prettier */
export interface InventoryData {
  clientId: string;
  productName: string;
  unitId: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  description: string;
  hsnCode: string;
  sac: string;
  purchasePrice: number;
  sellingPrice: number;
  cgst: number;
  sgst: number;
  igst: number;
  openingStock: number;
  minimumStock: number;
  vendorId: string;
  vendorName: string;
}

export interface IProductData {
  productId: string;
  clientId: string;
  productName: string;
  description: string;
  quantityInStock: string;
  vendorId: string;
  recorderLevel: number;
  unitPrice: string;
  unitId: string;
  categoryId: string;
}
