import axios from "axios";

const apiClient = axios.create();

export default {
  getStatus() {
    return apiClient.get("/api/v1/status");
  },
  checkValidity(asn, prefix) {
    return apiClient.get("/api/v1/validity/" + asn + "/" + prefix);
  },
  mockSearchBgpAlloc(prefix, options) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve({
          prefix: "193.0.10.0/24",
          type: "exact_match",
          // results: [
          //   { source: "bgp", origin_asn: null },
          //   { source: "rir_alloc", rir: null }
          // ],
          results: [],
          relations: [
            {
              type: "less_specific",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "193.0.0.0/20"
            },
            {
              type: "less_specific",
              results: [
                { source: "bgp", origin_asn: "AS3333" },
                { source: "rir_alloc", rir: "ripe" }
              ],
              prefix: "193.0.10.0/23"
            },
            {
              type: "same_org",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "193.0.16.0/21"
            },
            {
              type: "same_org",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "84.205.64.0/19",
            },
            {
              type: "same_org",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "93.175.144.0/21",
            },
            {
              type: "same_org",
              results: [
                { source: "rir_alloc", rir: "ripe" },
                { source: "bgp", origin_asn: "AS12859" }
              ],
              prefix: "93.175.159.0/24"
            }
          ]
        });
      }, 10);
    });
  }
};
