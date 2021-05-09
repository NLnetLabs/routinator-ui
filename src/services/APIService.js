import axios from "axios";

const apiClient = axios.create();

export default {
  getStatus() {
    return apiClient.get("/api/v1/status");
  },
  checkValidity(asn, prefix) {
    return apiClient.get("/api/v1/validity/" + asn + "/" + prefix);
  },
  getROAs() {
    return apiClient.get("/json");
  }
};
