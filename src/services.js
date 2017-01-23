/** * Created by Administrator on 2017/1/23. */import Axios from 'axios';const appSettings = {  client_id: "tripgalleryimplicit",  tripGalleryAPI: "https://10.36.111.213/",  STSauthority: "http://10.36.111.213/identity",};const axiosInstance = Axios.create({  baseURL: 'https://10.36.111.213/api',  withCredentials: false});const post_logout_redirect_uri = window.location.protocol + "//" + window.location.host + "/posthandler.html?op=logout";const redirect_uri = window.location.protocol + "//" + window.location.host + "/posthandler.html?op=callback";const silent_redirect_uri = window.location.protocol + "//" + window.location.host + "/posthandler.html?op=silent_refresh";const oidcConfig = {  client_id: appSettings.client_id,  redirect_uri: redirect_uri,  post_logout_redirect_uri: post_logout_redirect_uri,  response_type: "id_token token",  scope: "openid profile gallerymanagement",  authority: appSettings.STSauthority,  silent_redirect_uri: silent_redirect_uri,  silent_renew: true,  with_credentials: false  //acr_values: "2fa"};import 'oidc-token-manager';const oidcMgr = new OidcTokenManager(oidcConfig);axiosInstance.interceptors.request.use(  function (cfg) {    debugger;    console.log('cfg,是http请求内容header,body等信息,拦截器在发送前处理这些内容', cfg);    if (!oidcMgr.expired && oidcMgr.access_token) {      cfg.headers.Authorization = 'Bearer ' + oidcMgr.access_token;    }    return cfg;  },  function (error) {    console.log(`--interceptors请求错误--`, error);    return Promise.reject(error);  });axiosInstance.interceptors.response.use(  null && function (cfg) {return cfg;}, //如对数据进行加工,比如时间的格式化,那么请移除null  function (error) {    debugger;    console.log(`--interceptors响应错误--`, error);    if (error.response.status === 401) {      localStorage.setItem('last-url', window.location.href);      oidcMgr.redirectForToken();    }    else {      console.log('---响应错误--', error.response)      alert('请求错误:', error.response);    }    return Promise.reject(error);  });export {axiosInstance, oidcMgr};// if (oidcMgr.expired) {//   debugger;//   console.log('------------访问令牌过期,重新访问-------------');////   //localStorage.setItem('last-route',vm.$route.path)//   localStorage.setItem('last-url',window.location.href)//   oidcMgr.redirectForToken();// }// //api服务的规则:如果是公共api应采用jsonp访问,否则必须鉴权// if (cfg.url.indexOf(appSettings.tripGalleryAPI) === 0) {//   console.log('---!---', cfg)//   debugger;//   cfg.headers.Authorization = 'Bearer ' + oidcMgr.access_token;//   console.log(cfg.headers.Authorization);// }