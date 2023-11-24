import { InventoryData } from 'types/inventoryInfo';
import { apiInventory } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const InvetoryAPI = {
    get: async function (clientId: string, cancel = false) {
      const response = await apiInventory.request({
        url: `/v1/GetAllProducts/${clientId}`,
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });

      return response.data;
    }
  },
  getAllProducts = async function (clientId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/GetAllProducts/${clientId}`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllProducts.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  },
  deleteProductRequest = async function (clientId: string, cancel = false) {
    const response = await apiInventory.request({
      url: `/v1/products/${clientId}`,
      method: 'DELETE',
      signal: cancel ? cancelApiObject[deleteProductRequest.name].handleRequestCancellation().signal : undefined
    });

    return response.data;
  };

export async function createProductRequest(inventroydata: InventoryData) {
  const response = await apiInventory.request({
    url: `v1/products`,
    method: 'POST',
    data: inventroydata
  });
  return response.status;
}

const cancelApiObject = defineCancelApiObject(InvetoryAPI);
