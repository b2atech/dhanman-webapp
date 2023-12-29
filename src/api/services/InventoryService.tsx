import { InventoryData } from 'types/inventoryInfo';
import { apiInventory } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const InvetoryAPI = {
    get: async function (companyId: string, cancel = false) {
      const response = await apiInventory.request({
        url: `companyId/${companyId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllUnits = async function (companyId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/units/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllUnits.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllCategories = async function (companyId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/categories/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllCategories.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllTaxCategory = async function (cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/productTaxCategories`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllTaxCategory.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  getAllProducts = async function (companyId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/products/${companyId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllProducts.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  deleteProductRequest = async function (companyId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/product/${companyId}`,
      method: 'DELETE',
      signal: cancel ? cancelApiObject[deleteProductRequest.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

export async function createProductRequest(inventroydata: InventoryData) {
  const response = await apiInventory.request({
    url: `v1/product`,
    method: 'POST',
    data: inventroydata
  });
  return response.data;
}
export async function updateProductRequest(inventroydata: InventoryData) {
  const response = await apiInventory.request({
    url: `v1/product`,
    method: 'PUT',
    data: inventroydata
  });
  return response.status;
}

const cancelApiObject = defineCancelApiObject(InvetoryAPI);
