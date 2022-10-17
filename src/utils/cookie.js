import cookie from 'js-cookie';
 
export const SetCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, { expires: 7 });
    }
};
 
export const GetCookie = (name) => {
    if (process.browser) {
        return cookie.get(name)
    }return null;
}
 
export const RemoveCookie = (name)=>{
    return cookie.remove(name);
}