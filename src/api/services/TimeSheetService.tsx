import { apiTimeSheet } from '../axiosConfig';
import { defineCancelApiObject } from '../axiosUtils';

export const TimeSheetAPI = {
    get: async function (cancel = false) {
      const response = await apiTimeSheet.request({
        url: '/',
        method: 'GET',
        signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined
      });
      return response.data;
    }
  },
  getAllProjects = async function (cancel = false) {
    const response = await apiTimeSheet.request({
      url: `v1/getAllProjects`,
      method: 'GET',
      signal: cancel ? cancelApiObject[getAllProjects.name].handleRequestCancellation().signal : undefined
    });

    return response.data.items;
  };

const cancelApiObject = defineCancelApiObject(TimeSheetAPI);
