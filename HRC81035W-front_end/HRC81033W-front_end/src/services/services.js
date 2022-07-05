import axios from "axios";
import { SERVER_URL } from "../utils/constants";

export function serviceCall() {
  return axios.post(`${SERVER_URL}`);
}

export function callDummyAPI(name) {
  return axios.post(
    `${SERVER_URL}/dummy.do?`,
    {},
    {
      headers: { "Content-Type": "application/json" },
      params: { name: name },
    }
  );
}
