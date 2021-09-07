<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="text-center welcome">
          <!----  Prefix + ASN inputs ------------>
          <div style="text-align: left">
            <el-form
              :inline="true"
              label-position="top"
              label-width="90px"
              :status-icon="true"
              :model="searchForm"
            >
              <el-form-item
                :label="$t('common.prefix')"
                style="margin-bottom: 48px;"
              >
                <el-input
                  v-model="searchForm.prefix"
                  placeholder="e.g. 192.0.2.0/24"
                  clearable
                  required
                  @keyup.enter.native="validateAnnouncement"
                ></el-input>
                <div
                  v-if="searchOptions.relatedFromAlloc"
                  class="options-text"
                  style="text-align: left; position: absolute"
                >
                  related prefixes will be added
                </div>
              </el-form-item>
              <el-form-item
                :label="$t('home.origin')"
                style="margin-bottom: 48px;"
              >
                <el-input
                  v-model="searchForm.asn"
                  placeholder="e.g. 64511"
                  clearable
                  @keyup.enter.native="validateAnnouncement"
                  @clear="switchParam('validateBGP', true)"
                  @focus="switchParam('validateBGP', false)"
                ></el-input>
                <div
                  class="bgp-popover-text"
                  style="text-align: left; position: absolute;"
                >
                  <div v-if="searchOptions.validateBGP" class="options-text">
                    will be validated with BGP ASN
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!--- End of Prefix + ASN inputs --------->

          <!-- Validation Button + ----------------->
          <div style="text-align: left; margin-top: 2rem">
            <el-form>
              <el-form-item>
                <el-button type="primary" @click="validateAnnouncement">{{
                  $t("home.validate")
                }}</el-button
                ><el-button type="text" @click="setShowOptions">{{
                  (showOptions && "hide options") || "show options"
                }}</el-button>
              </el-form-item>
            </el-form>
            <el-alert
              type="error"
              effect="dark"
              v-if="error"
              :title="error"
              @close="resetError"
            />
            <el-alert
              type="warning"
              effect="dark"
              v-if="warning"
              :title="warning"
              @close="resetError"
            />
          </div>
          <div class="spacer" v-if="firstSearch">&nbsp;</div>
        </div>

        <!----- end of Validation Button -------------------->

        <div
          v-if="showOptions"
          style="text-align: left; margin-top: 1rem"
          class="options-box"
        >
          <el-form label-position="top">
            <el-form-item style="text-align: left" label="ASN lookup">
              <el-switch
                active-text="Validate Prefixes for ASN found in BGP"
                name="type"
                v-model="searchOptions.validateBGP"
              ></el-switch>
              <el-popover
                class="item"
                effect="dark"
                trigger="click"
                width="200"
                placement="top"
              >
                <div slot="default" style="word-break: break-word;">
                  With smiles and kisses, we prefer to seek accord beneath our
                  star, although we're different (we concur) just as two drops
                  of water are.
                </div>
                <i class="el-icon-question" slot="reference"
              /></el-popover>
            </el-form-item>
            <el-form-item label="Origin ASN Validation Source">
              <el-switch
                inactive-text="Longest Matching Prefix"
                active-text="Exact Match only"
                name="type"
                v-model="searchOptions.exactMatchOnly"
                :disabled="!searchOptions.validateBGP"
              ></el-switch>
              <el-popover
                class="item"
                effect="dark"
                trigger="click"
                width="200"
                placement="top"
              >
                <div slot="default" style="word-break: break-word;">
                  Nothing can ever happen twice. In consequence, the sorry fact
                  is that we arrive here improvised and leave without the chance
                  to practice.
                </div>
                <i class="el-icon-question" slot="reference"
              /></el-popover>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <div v-if="loadingRoute && !this.error" class="loading">
      <i class="el-icon-loading"></i>
      {{ $t("common.loading") }}
    </div>

    <h4 class="header validation-header">
      VALIDATION
    </h4>

    <div v-if="validation && validation.route && !this.error">
      <el-divider />

      <h4 class="header">
        {{ $t("home.resultsfor") }}
        <span class="mono">{{ validation.route.prefix }}</span> -
        <span class="mono">{{ validation.route.origin_asn }}</span>
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
    <div v-else>
      <h4>No Origin ASN found for this Prefix in BGP.</h4>
      <div class="validation-description">
        You could enter an ASN to validate this prefix against and validate
        again.
      </div>
    </div>

    <div>
      <h4 class="header validation-header">
        RELATED PREFIXES
      </h4>
      <div v-if="ResultPrefixData.prefix">
        <h4 class="header" v-if="ResultPrefixData.same_org.length">
          Best Matching Prefix in Allocations and/or BGP<el-tag type="info"
            >Region {{ ResultPrefixData.same_org[0].rir }}</el-tag
          >
        </h4>
        <prefix-list-table
          :data="[
            {
              prefix: ResultPrefixData.prefix,
              bgp: ResultPrefixData.bgp,
              type: ResultPrefixData.type,
              rir: ResultPrefixData.rir,
              meta: ResultPrefixData.meta
            }
          ]"
          :searchAsn="searchForm.asn"
          :searchPrefix="searchForm.prefix"
          :validateBgp="searchOptions.validateBGP"
          :showAlloc="true"
          style="margin-bottom: 24px;"
        />

        <!------------- Less Specifics ---------------->
        <div
          v-if="
            ResultPrefixData.less_specifics &&
              ResultPrefixData.less_specifics.length
          "
        >
          <el-header style="background: none; height: 48px;">
            <el-row>
              <el-col :span="22">
                <el-button type="text" @click="setShowLessSpecific">
                  + {{ ResultPrefixData.less_specifics.length }} less specific
                </el-button>
              </el-col>
              <el-col :span="2">
                <el-switch
                  active-text="show"
                  name="type"
                  v-model="searchOptions.relatedLessSpecificExpanded"
                  style="margin-top: 15%;"
                ></el-switch>
              </el-col>
            </el-row>
          </el-header>

          <el-main v-if="searchOptions.relatedLessSpecificExpanded">
            <prefix-list-table
              :data="ResultPrefixData.less_specifics"
              :searchAsn="searchForm.asn"
              :searchPrefix="searchForm.prefix"
              validateBgp="false"
              :showAlloc="true"
            />
          </el-main>
        </div>

        <!----------------- More Specifics --------------->

        <div
          v-if="
            ResultPrefixData.more_specifics &&
              ResultPrefixData.more_specifics.length
          "
        >
          <el-header style="background: none;height: 48px;">
            <el-row>
              <el-col :span="22">
                <el-button type="text" @click="setShowMoreSpecific">
                  + {{ ResultPrefixData.more_specifics.length }} more specific
                </el-button>
              </el-col>
              <el-col :span="2">
                <el-switch
                  active-text="show"
                  name="type"
                  v-model="searchOptions.relatedMoreSpecificExpanded"
                  style="margin-top: 15%;"
                ></el-switch>
              </el-col>
            </el-row>
          </el-header>

          <el-main v-if="searchOptions.relatedMoreSpecificExpanded">
            <prefix-list-table
              :data="ResultPrefixData.more_specifics"
              :searchAsn="searchForm.asn"
              :searchPrefix="searchForm.prefix"
              validateBgp="false"
              :showAlloc="true"
            />
          </el-main>
        </div>

        <!----------------- Allocations ----------------->

        <div
          v-if="ResultPrefixData.same_org && ResultPrefixData.same_org.length"
        >
          <el-header style="background: none;height: 48px;">
            <el-row>
              <el-col :span="22">
                <el-button
                  type="text"
                  @click="setShowRelatedAlloc"
                  v-if="
                    ResultPrefixData.same_org &&
                      ResultPrefixData.same_org.length
                  "
                >
                  + {{ ResultPrefixData.same_org.length }} allocated to the same
                  Organisation
                  <el-tag
                    type="info"
                    style="position: absolute; margin-left: 12px; margin-top: -8px;"
                    >Region {{ ResultPrefixData.same_org[0].rir }}</el-tag
                  >
                </el-button>
              </el-col>
              <el-col :span="2">
                <el-switch
                  active-text="show"
                  name="type"
                  v-model="searchOptions.relatedFromAlloc"
                  style="margin-top: 15%;"
                ></el-switch>
              </el-col>
            </el-row>
          </el-header>

          <el-main v-if="searchOptions.relatedFromAlloc">
            <Prefix-list-table
              :data="ResultPrefixData.same_org"
              :searchAsn="searchForm.asn"
              :searchPrefix="searchForm.prefix"
              validateBgp="false"
              :showAlloc="false"
            />
          </el-main>
        </div>
        <div v-else>no related prefixes found</div>
      </div>
      <div v-else class="validation-description">No less or more specific prefixes in either Allocations and BGP, or prefixes for the same organisation were found.</div>
    </div>

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
      ResultPrefixData: [],
      searchForm: {
        asn: "",
        prefix: ""
      },
      searchOptions: {
        validateBGP: true,
        relatedFromAlloc: false,
        relatedLessSpecificExpanded: false,
        relatedMoreSpecificExpanded: false,
        exactMatchOnly: false
      },
      showOptions: true,
      error: null,
      warning: null
    };
  },
  created() {
    this.loadRoute();
    this.loadStatus();
  },
  methods: {
    loadRoute() {
      console.log(this.$route.query);
      console.log(this.$route.params);

      if (this.$route.query.include === "related_alloc") {
        console.log("switch on include related alloc");
        this.searchOptions.relatedFromAlloc = true;
      }

      if (this.$route.query.include === "related_less_specific") {
        console.log("switch on include related alloc");
        this.searchOptions.relatedLessSpecificExpanded = true;
      }
      if (this.$route.query.include === "related_alloc") {
        console.log("switch on include related less specific");
        this.searchOptions.relatedLessSpecificExpanded = true;
      }

      if (this.$route.query.include === "related_more_specific") {
        console.log("switch on include related more specific");
        this.searchOptions.relatedMoreSpecificExpanded = true;
      }
      if (this.$route.query.include === "related_more_specific") {
        console.log("switch on include related alloc");
        this.searchOptions.relatedMoreSpecificExpanded = true;
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

          this.validatePrefix();
          return;
        }
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
    switchParam(key, status) {
      if (status === undefined) {
        return;
      }
      console.log(`switch ${key} ${(status === true && "on") || "off"}`);
      this.searchOptions[key] = status;
    },

    setQueryParams() {
      let changed = false;

      const queryParamMap = {
        validateBGP: { name: "validate-bgp", type: Boolean },
        exactMatchOnly: { name: "exact-match-only", type: Boolean },
        relatedFromAlloc: {
          name: "include",
          type: String,
          value: { true: "related_alloc" }
        },
        relatedLessSpecificExpanded: {
          name: "include",
          type: String,
          value: { true: "related_less_specific" }
        },
        relatedMoreSpecificExpanded: {
          name: "include",
          type: String,
          value: { true: "related_more_specific" }
        }
      };
      let query = {};

      Object.entries(this.searchOptions).forEach(o => {
        let qp = queryParamMap[o[0]];
        if (o[1]) {
          let value = (qp.type === Boolean && o[1]) || qp.value.true;
          query[qp.name] = value;
        } else {
          delete query[qp.name];
        }
      });

      router.push({ path: this.$route.path, query }).catch(() => {});
    },
    resetError() {
      this.error = null;
      this.warning = null;
    },
    // validate prefix input.

    // At least the prefix should be validated always,
    // until we implement searching on ASN
    // ASN need only be validated when the user wants
    // to validate PFX+AS pair.
    validateInput() {
      let prefixValid = false;
      let prefixValue = this.searchForm.prefix;
      if (cidrRegex({ exact: true }).test(prefixValue)) {
        prefixValid = true;
      } else {
        this.error = this.$t("home.pleasevalidprefix");
        // (this.error && `${this.error} ${this.$t("home.pleaseand")}`) ||
        // this.$t("home.pleasevalidprefix");
      }

      if (!this.searchOptions.validateBGP) {
        let asValid = false;
        let asValue = this.searchForm.asn;

        if (asValue !== "" && asValue.toLowerCase().indexOf("as") === 0) {
          asValue = asValue.substr(2) * 1;
        }
        if (asValue !== "" && asValue >= 0 && asValue <= 4294967295) {
          asValid = true;
          this.error = null;
        } else {
          this.error =
            (this.error && `${this.error} ${this.$t("home.pleaseand")}`) ||
            this.$t("home.pleasevalidasn");
        }
      }

      return this.error == null;
    },
    validatePrefix() {
      this.ResultPrefixData = [];
      this.validation = {};
      this.error = null;
      this.warning = null;
      let PrefAsn = {};

      if (!this.validateInput()) {
        return;
      }

      // Lookup BGP origin ASN and use that for validating the prefix the user
      // gave us.
      if (this.searchOptions.validateBGP) {
        console.log(`loading bgp+alloc data for ${this.searchForm.prefix}`);
        this.loadingRoute = true;
        this.firstSearch = false;
        APIService.searchBgpAlloc(this.searchForm.prefix)
          .then(
            response => {
              this.loadingRoute = false;
              // Use the ASN we got back from the LMP in the
              // `relations[type="less-specific"]` when the user has set BGP Origin
              // Validation to fall back to the LMP.
              let hasBgpOrigin =
                response.data.result.prefix &&
                (response.data.result.type === "exact-match" ||
                  !this.searchOptions.exactMatchOnly) &&
                response.data.result.meta.find(m => m.sourceType === "bgp");
              if (hasBgpOrigin) {
                PrefAsn = {
                  prefix: this.searchForm.prefix,
                  origin_asn: hasBgpOrigin.originASNs[0]
                };
                this.searchForm.asn = hasBgpOrigin.originASNs[0];
              } else if (!this.searchOptions.exactMatchOnly) {
                this.PrefixResultData =
                  (Array.isArray(response.data) && response.data) || [];
                PrefAsn.origin_asn = this.extractAsnFromBgpAlloc(
                  response.data
                ).origin_asn;
                PrefAsn.prefix = this.searchForm.prefix;
                this.searchForm.asn = PrefAsn.origin_asn;
              } else {
                this.warning =
                  "Cannot find an Origin AS in BGP for this prefix";
                return;
              }

              if (PrefAsn.origin_asn) {
                console.log(
                  `validating ${PrefAsn.prefix} for ${PrefAsn.origin_asn}`
                );
                this.setQueryParams();
                APIService.checkValidity(
                  PrefAsn.origin_asn,
                  PrefAsn.prefix
                ).then(response => {
                  this.loadingRoute = false;
                  if (response.data && response.data.validated_route) {
                    this.validation = response.data.validated_route;
                  }
                });
              } else {
                console.log(
                  `no announced asn for ${PrefAsn.prefix}. can't validate.`
                );
                this.warning = `Can't find an Origin ASN in BGP for this Prefix`;
              }

              // Always store the related prefixes, so we
              // don't have to bother the roto API once more.
              // For now the roto API always returns the
              // related prefixes (there are no ?include=
              // queryParms implemented in it at the time of
              // this writing).
              if (response && response.data) {
                this.storeRelatedPrefixesData(response.data);
              }

              router
                .push({
                  path: `/${encodeURIComponent(PrefAsn.prefix)}`,
                  query: this.$route.query
                })
                .catch(() => {});
              // return;
            },
            err => {
              this.error =
                "The BGP Lookup Server failed with an unknown error. Please retry later.";
            }
          )
          .catch(err => {
            console.log("Roto backend failed: (#1)");
            console.error(err);
          });
      }

      // Straight forward validation with user-supplied ASN and prefix
      else if (this.searchForm.asn && this.searchForm.prefix) {
        console.log("Prefix + AS validation");

        if (this.error) {
          return;
        }
        this.loadingRoute = true;
        this.firstSearch = false;

        // Always store the related prefixes, so we
        // don't have to bother the roto API once more.
        // For now the roto API always returns the
        // related prefixes (there are no ?include=
        // queryParms implemented in it at the time of
        // this writing).
        APIService.searchBgpAlloc(this.searchForm.prefix).then(response => {
          if (response.data) {
            this.storeRelatedPrefixesData(response.data);
          }
        });

        PrefAsn.prefix = this.searchForm.prefix;
        PrefAsn.origin_asn = this.searchForm.asn;
        this.setQueryParams();
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
            path: `/${encodeURIComponent(PrefAsn.prefix)}/${
              PrefAsn.origin_asn
            }`,
            query: this.$route.query
          })
          .catch(() => {});
      }

      // Lookup and validate all prefixes that are allocated to the same organisation as the
      // one the user asked for.
      if (this.searchOptions.relatedFromAlloc) {
        this.loadingRoute = true;
        this.firstSearch = false;
        this.setQueryParams();
      }
      if (this.searchOptions.relatedLessSpecificExpanded) {
        this.loadingRoute = true;
        this.firstSearch = false;
        this.setQueryParams();
      }
      if (this.searchOptions.relatedMoreSpecificExpanded) {
        this.loadingRoute = true;
        this.firstSearch = false;
        this.setQueryParams();
      }
    },
    setShowOptions() {
      this.showOptions = this.showOptions ? false : true;
    },
    setShowLessSpecific() {
      this.searchOptions.relatedLessSpecificExpanded = this.searchOptions
        .relatedLessSpecificExpanded
        ? false
        : true;
    },
    setShowMoreSpecific() {
      this.searchOptions.relatedMoreSpecificExpanded = this.searchOptions
        .relatedMoreSpecificExpanded
        ? false
        : true;
    },
    setShowRelatedAlloc() {
      this.searchOptions.relatedFromAlloc = this.searchOptions.relatedFromAlloc ? false : true;
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
      return DateTime.fromISO(timestamp, { zone: "utc" })
        .setLocale("en-us")
        .toRelative();
    },
    storeRelatedPrefixesData(response) {
      if (!response.result.relations) {
        return;
      }

      let bgp_s = response.result.meta.find(r => r.sourceType === "bgp");
      let rir_s = response.result.meta.find(r => r.sourceType === "rir-alloc");

      this.ResultPrefixData = {
        prefix: response.result.prefix,
        type: response.result.type,
        rir: (rir_s && rir_s.sourceID.toUpperCase()) || "NOT FOUND",
        bgp: (bgp_s && bgp_s.originASNs[0]) || "NOT SEEN",
        meta: response.result.meta,
        less_specifics: response.result.relations
          .find(r => r.type === "less-specific")
          .members.map(d => {
            let bgp_s = d.meta.find(r => r.sourceType === "bgp");
            let rir_s = d.meta.find(r => r.sourceType === "rir-alloc");
            return {
              prefix: d.prefix,
              type: d.type,
              rir: (rir_s && rir_s.sourceID.toUpperCase()) || "NOT FOUND",
              bgp: (bgp_s && bgp_s.originASNs[0]) || "NOT SEEN",
              meta: d.meta
            };
          }),
        more_specifics: response.result.relations
          .find(r => r.type === "more-specific")
          .members.map(d => {
            let bgp_s = d.meta.find(r => r.sourceType === "bgp");
            let rir_s = d.meta.find(r => r.sourceType === "rir-alloc");
            return {
              prefix: d.prefix,
              type: d.type,
              rir: (rir_s && rir_s.sourceID.toUpperCase()) || "NOT FOUND",
              bgp: (bgp_s && bgp_s.originASNs[0]) || "NOT SEEN",
              meta: d.meta
            };
          }),
        same_org: response.result.relations
          .find(r => r.type === "same-org")
          .members.map(d => {
            let bgp_s = d.meta.find(r => r.sourceType === "bgp");
            let rir_s = d.meta.find(r => r.sourceType === "rir-alloc");
            return {
              prefix: d.prefix,
              type: d.type,
              rir: (rir_s && rir_s.sourceID.toUpperCase()) || "NOT FOUND",
              bgp: (bgp_s && bgp_s.originASNs[0]) || "NOT SEEN"
            };
          })
      };
    },
    // Looks for the Origin ASN of the BGP announcement of the longest
    // matching prefix, including the exactly matching one.
    // return { origin_asn: null, ...} if it can't find one.
    extractAsnFromBgpAlloc(response) {
      let source = response.result.meta.find(s => s.sourceType === "bgp");
      if (source) {
        return { origin_asn: source.originASNs[0], prefix: response.prefix };
      }

      if (!response.result.relations) {
        return { origin_asn: null, prefix: response.prefix };
      }

      // look for the longest prefix in the less-specific related ones,
      // and return the origin_asn of the BGP announcement if it exists.
      let lmp_re = response.result.relations
        .find(rel => rel.type === "less-specific")
        .members.reduce((rel, lmp) => {
          if (
            Number(rel.prefix.split("/")[1]) > Number(lmp.prefix.split("/")[1])
          ) {
            lmp = rel;
          }
          return lmp;
        }, []);
      let bgp_rec =
        lmp_re.result && lmp_re.result.meta.find(s => s.sourceType === "bgp");
      return {
        origin_asn: (bgp_rec && bgp_rec.originASNs[0]) || null,
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
h4.header,
.validation-header {
  margin-top: 3rem !important;
  .el-tag {
    margin-left: 1rem;
    text-transform: uppercase;
  }
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
  font-weight: 400;
  margin-top: 0.6rem;
}

.header {
  font-weight: 500 !important;
}

.validation-header {
  font-weight: 600 !important;
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
  white-space: nowrap;
  color: #606266;
}

.options-box {
  background-color: #fafafa;
  padding: 12px 24px;
}
</style>
