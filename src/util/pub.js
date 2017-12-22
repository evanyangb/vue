import axios from 'axios'

window.axios = axios;

//获取cookie
window.getCookie = (key) =>{
    let arr =document.cookie.split("; ");
    for(let i=0;i<arr.length;i++){
        let arr2=arr[i].split("=");
        if(arr2[0]===key){
            return arr2[1];
        }
    }
    return false;
};
export default {axios,getCookie}