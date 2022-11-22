import axios from "axios";
import jwt_decode from "jwt-decode";
// READ ME: fix the expiry date of the new token

async function RefreshToken(refreshToken) {
  try {
    const res = await axios.post("http://localhost:3001/refresh", {
      refreshToken: refreshToken,
    });
    localStorage.setItem("token", JSON.stringify(res.data));
    return res.data.token;
  } catch (err) {
    console.log(err);

    return null;
  }
}

 async function RefreshIntercept(config) {
  var userInfo = JSON.parse(localStorage.getItem("token"));
  let currentDate = new Date();
  const decodedToken = jwt_decode(userInfo.token);
  if (decodedToken.exp * 1000 < currentDate.getTime()) {
    console.log("expired");
    var token = await  RefreshToken(userInfo.refreshToken);
    console.log("token refreshed");
    //config.headers["authorization"] = "Bearer " + token;
  }
  return config;
}

export default RefreshIntercept;
