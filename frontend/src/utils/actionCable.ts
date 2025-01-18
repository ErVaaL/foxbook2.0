import { createConsumer } from "@rails/actioncable";
import Cookies from "js-cookie";

const getToken = () => sessionStorage.getItem("authToken") || "";

const setWebSocketToken = (token: string) => {
  Cookies.set("cable_token", token, { secure: true, sameSite: "Strict" });
};

const createCable = () => {
  const token = getToken();
  if (!token) {
    console.error("❌ No token found, WebSocket connection will fail!");
    return null;
  }

  setWebSocketToken(token);

  console.log(`🔗 Connecting WebSocket with token: ${token}`);

  return createConsumer(`ws://localhost:3000/cable?token=${token}`);
};

const cable = createCable();

export default cable;
