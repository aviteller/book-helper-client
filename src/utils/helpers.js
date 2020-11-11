import  globalConfig  from "../config/config";
import Cookies  from "./Cookies"

const c = new Cookies()

export const customFetch = (endPoint, { body, ...customConfig } = {}) => {

  // console.log(endPoint)

  let authHeader = "";

  if(authHeader = c.getCookie('user-jwt')) {
    authHeader = `Bearer ${JSON.parse(authHeader).jsonToken}`;
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if(authHeader != "" ) {
    headers.Authorization = authHeader
  }

  const config = {
    method: body ? "POST" : "GET",
    // credentials: "include",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return window.fetch(globalConfig.api + endPoint, config).then(async (res) => {

      
      const data = await res.json();
   
        return data;
    


  });
};