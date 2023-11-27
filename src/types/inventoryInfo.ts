export interface InventoryData {
  clientId: string;
  productName: string;
  quantityInStock: string;
  description: string;
  unitPrice: string;
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
