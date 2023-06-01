export const getCookiesFromResponse = (res) => {
  let cookies = res.headers["set-cookie"][0].split(";")[0] + "; ";
  cookies += res.headers["set-cookie"][1].split(";")[0] + "; ";
  return cookies;
};

//This is to get the X-XSRF-TOKEN from any response of Sanctum or API Breeze,
//In my case, the token is always returned first,
//so you can edit for get independent of position
export const getXXsrfToken = (res) => {
  return decodeURIComponent(
    res.headers["set-cookie"][0].split(";")[0].replace("XSRF-TOKEN=", "")
  );
};
