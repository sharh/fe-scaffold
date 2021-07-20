import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { cryptId, getClientKey, getQueryParams } from "./index";
import { GetCacheByKey } from "./storage";
import CONFIG from "@/config/index";
const clientKey = getClientKey();
const defaultAxios = getRequest();
const baseURL = CONFIG.apiBase;
defaultAxios.defaults.baseURL = baseURL;
const commonAxios = Axios.create();
function getRequest(
  options?: AxiosRequestConfig & { successCode: string | number },
) {
  let axios = Axios.create(options);
  axios.interceptors.response.use(
    (res) => {
      let data = res.data;
      if (
        data.code &&
        (data.code === "000001" || data.code === options?.successCode)
      ) {
        return data.data;
      } else {
        alertMsg(res);
      }
      throw data;
    },
    (res) => {
      console.log("err--->", res);
      alertMsg(res);
      return Promise.reject(res);
    },
  );
  return axios;
}
export default function request(options: AxiosRequestConfig): Promise<any> {
  return defaultAxios(options) as any;
}
// res: AxiosResponse
function alertMsg(res: AxiosResponse<any> & { message?: string }) {
  console.log("alertMsg", res);
}
