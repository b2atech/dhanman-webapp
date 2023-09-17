import axios from 'axios';
import { notification } from 'antd';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'; // for POST requests
axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*'; // for POST requests
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'; // for all requests

export const apiPurchase = axios.create({
  baseURL: 'https://api-dhanman-purchase-nonprod.azurewebsites.net/api/'
});

export const apiSales = axios.create({
  baseURL: 'https://api-dhanman-sales-nonprod.azurewebsites.net/api/'
});

const errorHandler = (error: any) => {
  const statusCode = error.response?.status;

  if (error.code === 'ERR_CANCELED') {
    notification.error({
      placement: 'bottomRight',
      description: 'API canceled!',
      message: undefined
    });
    return Promise.resolve();
  }

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
apiPurchase.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

apiSales.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
