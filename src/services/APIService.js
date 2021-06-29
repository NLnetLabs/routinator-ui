import axios from "axios";

const apiClient = axios.create();

export default {
  getStatus() {
    return apiClient.get("/api/v1/status");
  },
  checkValidity(asn, prefix) {
    return apiClient.get(`/api/v1/validity/${asn}/${prefix}`);
  },
  searchBgpAlloc(prefix, options) {
    return apiClient.get(`/api/v1/${prefix}/search`);
  },
  mockSearchBgpAlloc(prefix, options) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve({
          prefix: "193.0.10.0/24",
          type: "exact_match",
          // results: [
          //   { source: "bgp", origin_asnssss null },
          //   { source: "rir_alloc", rir: null }
          // ],
          results: [],
          relations: [
            {
              type: "less-specific",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "193.0.0.0/20"
            },
            {
              type: "less-specific",
              results: [
                { source: "bgp", origin_asns: "AS3333" },
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
                { source: "bgp", origin_asns: "AS12859" }
              ],
              prefix: "93.175.159.0/24"
            }
          ]
        });
      }, 10);
    });
  }
};
