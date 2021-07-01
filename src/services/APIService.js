import axios from "axios";

const apiClient = axios.create();

export default {
  getStatus() {
    // Use the VUE_APP_ROUTINATOR_API_HOST env var if set,
    // it's defined in a .env[.mode] file in the root of the project.
    let routinatorHost = process.env.VUE_APP_ROUTINATOR_API_HOST || "";
    return apiClient.get(
      `${(routinatorHost && "https://") || ""}${routinatorHost}/api/v1/status`
    );
  },
  checkValidity(asn, prefix) {
    // Use the VUE_APP_ROUTINATOR_API_HOST env var if set,
    // it's defined in a .env[.mode] file in the root of the project.
    let routinatorHost = process.env.VUE_APP_ROUTINATOR_API_HOST || "";
    return apiClient.get(
      `${(routinatorHost && "https://") ||
        ""}${routinatorHost}/api/v1/validity/${asn}/${prefix}`
    );
  },
  searchBgpAlloc(prefix, options) {
    let rotoHost = process.env.VUE_APP_ROTO_API_HOST || "";
    return apiClient.get(
      `${(rotoHost && "https://") ||
        ""}${rotoHost}/api/v1/prefix/${prefix}/search`
    );
  },
  mockSearchBgpAlloc(prefix, options) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve({
          prefix: "193.0.10.0/24",
          type: "exact_match",
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
              prefix: "84.205.64.0/19"
            },
            {
              type: "same_org",
              results: [{ source: "rir_alloc", rir: "ripe" }],
              prefix: "93.175.144.0/21"
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
