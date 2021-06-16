<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="16" :offset="4">
          <div class="text-center welcome">
            <div v-if="firstSearch">
              <img src="@/assets/images/welcome.svg" />
            </div>

            <h3 v-if="firstSearch">
              {{ $t("home.welcome") }}
            </h3>
            <div style="text-align: left">
              <el-form
                :inline="true"
                label-position="right"
                label-width="90px"
                :status-icon="true"
                :model="searchForm"
              >
                <el-form-item :label="$t('home.origin')">
                  <el-input
                    v-model="searchForm.asn"
                    placeholder="e.g. 64511"
                    clearable
                    :disabled="searchOptions.validateBGP"
                    @keyup.enter.native="validateAnnouncement"
                  ></el-input>
                  <div class="bgp-popover-text" style="text-align: left">
                    <el-button type="text" @click="setShowOptions"
                      >more options</el-button
                    >
                    <div v-if="searchOptions.validateBGP" class="options-text">
                      + validate with BGP ASN
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('common.prefix')">
                  <el-input
                    v-model="searchForm.prefix"
                    placeholder="e.g. 192.0.2.0/24"
                    clearable
                    @keyup.enter.native="validateAnnouncement"
                  ></el-input>
                  <div
                    v-if="searchOptions.relatedFromAlloc"
                    class="options-text"
                    style="text-align: left; position: absolute"
                  >
                    + related prefixes
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div
              v-if="showOptions"
              style="text-align: left; margin-left: 90px; margin-top: 1rem"
            >
              <el-form label-position="top">
                <el-form-item style="text-align: left" label="ASN lookup">
                  <el-switch
                    active-text="Validate Prefixes for ASN found in BGP"
                    name="type"
                    v-model="searchOptions.validateBGP"
                    @change="toggleParam({ validate_bgp: true })"
                  ></el-switch>
                  <el-popover
                    class="item"
                    effect="dark"
                    trigger="click"
                    width="200"
                    placement="top"
                  >
                    <div slot="default" style="word-break: break-word;">
                      With smiles and kisses, we prefer to seek accord beneath
                      our star, although we're different (we concur) just as two
                      drops of water are.
                    </div>
                    <i class="el-icon-question" slot="reference"
                  /></el-popover>
                </el-form-item>
                <el-form-item
                  label="Origin ASN Validation Source"
                  v-if="searchOptions.validateBGP"
                >
                  <el-switch
                    inactive-text="Longest Matching Prefix"
                    active-text="Exact Match only"
                    name="type"
                    v-model="searchOptions.exactMatchOnly"
                    @change="toggleParam({ exact_match_only: true })"
                  ></el-switch>
                  <el-popover
                    class="item"
                    effect="dark"
                    trigger="click"
                    width="200"
                    placement="top"
                  >
                    <div slot="default" style="word-break: break-word;">
                      Nothing can ever happen twice. In consequence, the sorry
                      fact is that we arrive here improvised and leave without
                      the chance to practice.
                    </div>
                    <i class="el-icon-question" slot="reference"
                  /></el-popover>
                </el-form-item>
                <el-form-item label="Prefixes Search">
                  <el-switch
                    active-text="Show all Prefixes from the same Organisation in RIR Allocations"
                    name="type"
                    v-model="searchOptions.relatedFromAlloc"
                    @change="toggleParam({ include: 'related_alloc' })"
                  ></el-switch>
                  <el-popover
                    class="item"
                    effect="dark"
                    trigger="click"
                    width="200"
                    placement="top"
                  >
                    <div slot="default" style="word-break: break-word;">
                      One day, perhaps some idle tongue mentions your name by
                      accident: I feel as if a rose were flung into the room,
                      all hue and scent.
                    </div>
                    <i class="el-icon-question" slot="reference"
                  /></el-popover>
                </el-form-item>
              </el-form>
            </div>
            <div style="text-align: center">
              <el-form>
                <el-form-item>
                  <el-button type="primary" @click="validateAnnouncement">{{
                    $t("home.validate")
                  }}</el-button>
                </el-form-item>
              </el-form>
              <el-tag size="mini" type="danger" v-if="error">{{
                error
              }}</el-tag>
            </div>
            <div class="spacer" v-if="firstSearch">&nbsp;</div>
          </div>
        </el-col>
      </el-row>

      <div v-if="loadingRoute" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("common.loading") }}
      </div>

      <div v-if="validation && validation.route && !this.error">
        <h4 class="header validation-header">
          {{ $t("home.resultsfor") }} {{ validation.route.origin_asn }} -
          {{ validation.route.prefix }}
          <el-tag type="success" v-if="validation.validity.state === 'valid'">{{
            $t("home.valid")
          }}</el-tag>
          <el-tag type="warning" v-if="validation.validity.state === 'invalid'"
            >{{ $t("home.invalid") }} {{ validation.validity.reason }}</el-tag
          >
        </h4>
        <div class="validation-description">
          {{ validation.validity.description }}
        </div>

        <validity-table
          v-if="
            validation.validity.VRPs && validation.validity.VRPs.matched.length
          "
          :label="$t('home.matched')"
          :isValid="true"
          :data="validation.validity.VRPs.matched"
        />
        <validity-table
          v-if="
            validation.validity.VRPs &&
              validation.validity.VRPs.unmatched_as.length
          "
          :label="$t('home.unmatchedasn')"
          :data="validation.validity.VRPs.unmatched_as"
        />
        <validity-table
          v-if="
            validation.validity.VRPs &&
              validation.validity.VRPs.unmatched_length.length
          "
          :label="$t('home.unmatchedlength')"
          :data="validation.validity.VRPs.unmatched_length"
        />
      </div>

      <div v-if="searchOptions.relatedFromAlloc && RisAllocData.length">
        <h4 class="header validation-header">
          RELATED PREFIXES
        </h4>
        <h4 class="header validation-header">
          Prefixes allocated to the same Organisation in Region
          {{ RisAllocData[0].rir }}
        </h4>
        <prefix-list-table :data="RisAllocData" :searchAsn="searchForm.asn" />
      </div>
    </el-card>

    <div v-if="loadingStatus" class="loading">
      <i class="el-icon-loading"></i>
      {{ $t("common.loading") }}
    </div>

    <el-row class="airy">
      <el-col :span="24">
        <div v-if="status && status.lastUpdateDone" class="last-update">
          {{ $t("home.runat") }} {{ getTimestamp(status.lastUpdateDone) }} ({{
            fromNow(status.lastUpdateDone)
          }})
        </div>
      </el-col>
    </el-row>

    <el-row v-if="status && status.tals">
      <el-col
        :span="4"
        v-for="(tal, index) in Object.keys(status.tals)"
        :key="index"
        :offset="index % 5 !== 0 ? 1 : 0"
      >
        <tal :label="tal" :data="status.tals[tal]" :detailed="false" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import router from "@/router";
import Tal from "@/components/Tal";
import ValidityTable from "@/components/ValidityTable";
import PrefixListTable from "@/components/PrefixListTable";
const cidrRegex = require("cidr-regex");
import { DateTime } from "luxon";

export default {
  components: {
    Tal,
    ValidityTable,
    PrefixListTable
  },
  data() {
    return {
      firstSearch: true,
      loadingStatus: true,
      loadingRoute: false,
      status: {},
      validation: {},
      RisAllocData: [],
      searchForm: {
        asn: "",
        prefix: ""
      },
      searchOptions: {
        validateBGP: false,
        relatedFromAlloc: false,
        exactMatchOnly: false
      },
      showOptions: false,
      error: null
    };
  },
  created() {
    this.loadRoute();
    this.loadStatus();
  },
  watch: {
    $route() {
      this.loadRoute();
    }
  },
  methods: {
    loadRoute() {
      console.log(this.$route.query);
      console.log(this.$route.params);

      if (this.$route.query.include === "related_alloc") {
        console.log("switch on include related alloc");
        this.searchOptions.relatedFromAlloc = true;
      }

      if (this.$route.query.exact_match_only) {
        console.log("switch on exact match only");
        this.searchOptions.exactMatchOnly = true;
      }

      if (this.$route.query.validate_bgp) {
        console.log("switch on validate_bgp");
        this.searchOptions.validateBGP = true;

        // if the prefix is in the URL,
        // we have enough to validate, so do it.
        if (this.$route.params.prefix) {
          this.searchForm.prefix = this.$route.params.prefix;
        }
        this.validatePrefix();
        return;
      }

      // straight forward as + prefix validation
      if (this.$route.params.asn || this.$route.query.asn) {
        this.searchForm.asn = this.$route[
          this.$route.params.asn ? "params" : "query"
        ].asn;
        this.searchForm.prefix = this.$route[
          this.$route.params.asn ? "params" : "query"
        ].prefix;

        this.validatePrefix();
        return;
      }

      // We still may have a valid prefix in the URL,
      // but we can't validate, because we're missing some
      // info. Do not discard settings and copy the URL
      // prefix into the input.
      if (this.$route.params.prefix || this.$route.query.asn) {
        if (this.$route.params.prefix) {
          this.searchForm.prefix = this.$route.params.prefix;
        }
        this.validatePrefix();
        return;
      }
    },
    loadStatus() {
      this.loadingStatus = true;
      APIService.getStatus().then(response => {
        this.status = response.data;
        this.loadingStatus = false;
        if (this.status && this.status.version) {
          this.$emit("update-version", this.status.version);
        }
      });

      return false;
    },
    toggleParam(param) {
      let key = Object.keys(param)[0];
      if (!this.$route.query[key]) {
        router.push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            [key]: Object.values(param)[0]
          }
        });
      } else {
        let { [key]: del, ...query } = this.$route.query;
        console.log(this.$route.query);
        console.log(query);
        router.push({ path: this.$route.path, query });
      }
    },
    validatePrefix() {
      this.RisAllocData = [];
      let asValid = false;
      let asValue = this.searchForm.asn;
      let PrefAsn = {};
      if (asValue !== "" && asValue.toLowerCase().indexOf("as") === 0) {
        asValue = asValue.substr(2) * 1;
      }
      if (asValue !== "" && asValue >= 0 && asValue <= 4294967295) {
        asValid = true;
        this.error = null;
      } else if (
        this.searchOptions.validateBGP
      ) {
        asValid = true;
        this.error = null;
      } else {
        this.error = this.$t("home.pleasevalidasn");
      }

      let prefixValid = false;
      let prefixValue = this.searchForm.prefix;
      if (cidrRegex({ exact: true }).test(prefixValue)) {
        prefixValid = true;
      } else {
        this.error =
          (this.error && `${this.error} ${this.$t("home.pleaseand")}`) ||
          this.$t("home.pleasevalidprefix");
      }

      if (this.error) {
        return;
      }

      // Lookup BGP origin ASN and use that for validating the prefix the user
      // gave us.
      if (this.searchOptions.validateBGP) {
        console.log(`loading bgp+alloc data for ${this.searchForm.prefix}`);
        this.loadingRoute = true;
        this.firstSearch = false;
        APIService.mockSearchBgpAlloc(this.searchForm.prefix).then(response => {
          this.loadingRoute = false;
          // Use the ASN we got back from the LMP in the
          // `relations[type="less-specific"]` when the user has set BGP Origin
          // Validation to fall back to the LMP.
          let hasBgpOrigin = response.results.find(s => s.source === "bgp");
          if (hasBgpOrigin) {
            PrefAsn = {
              prefix: this.searchForm.prefix,
              origin_asn: hasBgpOrigin.origin_asn
            };
          } else if (!this.searchOptions.exactMatchOnly) {
            this.RisAllocData = (Array.isArray(response) && response) || [];
            PrefAsn.origin_asn = this.extractAsnFromBgpAlloc(
              response
            ).origin_asn;
            PrefAsn.prefix = this.searchForm.prefix;
          } else {
            this.error = "Cannot find an Origin AS in BGP for this prefix";
            return;
          }

          console.log(`validating ${PrefAsn.prefix} for ${PrefAsn.origin_asn}`);
          APIService.checkValidity(PrefAsn.origin_asn, PrefAsn.prefix).then(
            response => {
              this.loadingRoute = false;
              if (response.data && response.data.validated_route) {
                this.validation = response.data.validated_route;
              }
            }
          );

          router
            .push({
              path: `/${encodeURIComponent(PrefAsn.prefix)}`,
              query: this.$route.query
            })
            .catch(() => {});
            return;
        });
      }
      // Straight forward validation with user-supplied ASN and prefix
      else if (asValid && prefixValid) {
        console.log('AS+Prefix validation');
        this.loadingRoute = true;
        this.firstSearch = false;
        PrefAsn.prefix = this.searchForm.prefix;
        PrefAsn.origin_asn = this.searchForm.asn;
        APIService.checkValidity(PrefAsn.origin_asn, PrefAsn.prefix).then(
          response => {
            this.loadingRoute = false;
            if (response.data && response.data.validated_route) {
              this.validation = response.data.validated_route;
            }
          }
        );

        router
          .push({
            path: `/${PrefAsn.origin_asn}/${encodeURIComponent(
              PrefAsn.prefix
            )}`,
            query: this.$route.query
          })
          .catch(() => {});
      }

      // Lookup and validate all prefixes that are allocated to the same organisation as the
      // one the user asked for.
      if (this.searchOptions.relatedFromAlloc) {
        this.loadingRoute = true;
        this.firstSearch = false;
        APIService.mockSearchBgpAlloc(this.searchForm.prefix).then(response => {
          this.loadRoute = false;
          this.transformRelatedPrefixes(response);
        });
      }
    },
    setShowOptions() {
      this.showOptions = this.showOptions ? false : true;
    },
    validateAnnouncement() {
      this.validatePrefix();
    },
    getTimestamp(timestamp) {
      return DateTime.fromISO(timestamp, { zone: "utc" }).toFormat(
        "yyyy-MM-dd TTT"
      );
    },
    fromNow(timestamp) {
      return DateTime.fromISO(timestamp, { zone: "utc" }).toRelative();
    },
    transformRelatedPrefixes(response) {
      this.RisAllocData = response.relations
        .filter(r => r.type === "same_org")
        .map(d => {
          let bgp_s = d.results.find(r => r.source === "bgp");
          let rir_s = d.results.find(r => r.source === "rir_alloc");
          return {
            prefix: d.prefix,
            rir: (rir_s && rir_s.rir.toUpperCase()) || "NOT FOUND",
            bgp: (bgp_s && bgp_s.origin_asn) || "NOT SEEN"
          };
        });
    },
    extractAsnFromBgpAlloc(response) {
      let source = response.results.find(s => s.source === "bgp");
      if (source) {
        return { origin_asn: source.origin_asn, prefix: response.prefix };
      }
      let lmp_re = response.relations
        .filter(rel => rel.type === "less_specific")
        .reduce((rel, lmp) => {
          if (
            Number(rel.prefix.split("/")[1]) > Number(lmp.prefix.split("/")[1])
          ) {
            lmp = rel;
          }
          return lmp;
        });
      return {
        origin_asn: lmp_re.results.find(s => s.source === "bgp").origin_asn,
        prefix: lmp_re.prefix
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center;
}
.welcome {
  margin-top: 1rem;
  img {
    height: 160px;
    width: 200px;
  }
  h3 {
    margin-bottom: 2.5rem;
  }
  .spacer {
    margin-bottom: 1rem;
  }
}
h4.header {
  margin: 0;
}
.airy {
  margin-top: 4rem;
  margin-bottom: 3rem;
}
.loading {
  padding: 3rem;
  text-align: center;
  color: #999;
}
.validation-description {
  font-style: italic;
  margin-top: 0.6rem;
}
.validation-header {
  margin-top: 3rem !important;
  .el-tag {
    margin-left: 1rem;
    text-transform: uppercase;
  }
}
.last-update {
  font-size: 0.8rem;
  text-align: center;
  color: #999;
}
.bgp-popover-text {
  text-align: left;
}
.el-popper {
  text-align: right;
}
.options-text {
  font-style: italic;
  color: #606266;
}
</style>
