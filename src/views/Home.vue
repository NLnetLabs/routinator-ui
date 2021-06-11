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
                    :disabled="bgpForm.inBGP"
                    @keyup.enter.native="validateAnnouncement"
                  ></el-input>
                  <div class="bgp-popover-text" style="text-align: left">
                    <el-button type="text" @click="setUseOptions">more options</el-button>
                  </div>
                </el-form-item>
                <el-form-item :label="$t('common.prefix')">
                  <el-input
                    v-model="searchForm.prefix"
                    placeholder="e.g. 192.0.2.0/24"
                    clearable
                    @keyup.enter.native="validateAnnouncement"
                  ></el-input>
                  <div v-if="bgpForm.inAlloc" class="options-text" style="text-align: left">
                    + related prefixes
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div v-if="bgpForm.useOptions" style="text-align: left; margin-left: 90px">
              <el-form label-position="top">
                <el-form-item style="text-align: left" label="ASN lookup">
                  <el-switch
                    active-text="Validate Prefixes for ASN found in BGP"
                    name="type"
                    v-model="bgpForm.inBGP"
                  ></el-switch>
                  <el-popover
                    class="item"
                    effect="dark"
                    trigger="click"
                    width="200"
                    placement="top"
                  >
                    <div slot="default" style="word-break: break-word;">
                      With smiles and kisses, we prefer to seek accord beneath our star, although
                      we're different (we concur) just as two drops of water are.
                    </div>
                    <i class="el-icon-question" slot="reference"
                  /></el-popover>
                </el-form-item>
                <el-form-item label="Prefixes">
                  <el-switch
                    active-text="Add all Prefixes from the same Organisation in RIR Allocations"
                    name="type"
                    v-model="bgpForm.inAlloc"
                  ></el-switch>
                  <el-popover
                    class="item"
                    effect="dark"
                    trigger="click"
                    width="200"
                    placement="top"
                  >
                    <div slot="default" style="word-break: break-word;">
                      Nothing can ever happen twice. In consequence, the sorry fact is that we
                      arrive here improvised and leave without the chance to practice.
                    </div>
                    <i class="el-icon-question" slot="reference"/></el-popover
                ></el-form-item>
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
              <el-tag size="mini" type="danger" v-if="error">{{ error }}</el-tag>
            </div>
            <div class="spacer" v-if="firstSearch">&nbsp;</div>
          </div>
        </el-col>
      </el-row>

      <div v-if="loadingRoute" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("common.loading") }}
      </div>

      <div v-if="validation && validation.route">
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
        <div class="validation-description">{{ validation.validity.description }}</div>

        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.matched.length"
          :label="$t('home.matched')"
          :isValid="true"
          :data="validation.validity.VRPs.matched"
        />
        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.unmatched_as.length"
          :label="$t('home.unmatchedasn')"
          :data="validation.validity.VRPs.unmatched_as"
        />
        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.unmatched_length.length"
          :label="$t('home.unmatchedlength')"
          :data="validation.validity.VRPs.unmatched_length"
        />
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
const cidrRegex = require("cidr-regex");
import { DateTime } from "luxon";

export default {
  components: {
    Tal,
    ValidityTable
  },
  data() {
    return {
      firstSearch: true,
      loadingStatus: true,
      loadingRoute: false,
      status: {},
      validation: {},
      searchForm: {
        asn: "",
        prefix: ""
      },
      bgpForm: {
        inBGP: false,
        inAlloc: false,
        useOptions: false
      },
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
      if (this.$route.params.asn || this.$route.query.asn) {
        this.searchForm.asn = this.$route[this.$route.params.asn ? "params" : "query"].asn;
        this.searchForm.prefix = this.$route[this.$route.params.asn ? "params" : "query"].prefix;
        this.validatePrefix();
      } else {
        this.searchForm.asn = "";
        this.searchForm.prefix = "";
        this.validation = {};
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
    validatePrefix() {
      let asValid = false;
      let asValue = this.searchForm.asn;
      if (asValue !== "" && asValue.toLowerCase().indexOf("as") === 0) {
        asValue = asValue.substr(2) * 1;
      }
      if (asValue !== "" && asValue >= 0 && asValue <= 4294967295) {
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

      if (asValid && prefixValid) {
        this.loadingRoute = true;
        this.firstSearch = false;
        APIService.checkValidity(this.searchForm.asn, this.searchForm.prefix).then(response => {
          this.loadingRoute = false;
          if (response.data && response.data.validated_route) {
            this.validation = response.data.validated_route;
          }
        });
        router
          .push("/" + this.searchForm.asn + "/" + encodeURIComponent(this.searchForm.prefix))
          .catch(() => {});
      }
    },
    setUseOptions() {
      this.bgpForm.useOptions = this.bgpForm.useOptions ? false : true;
    },
    validateAnnouncement() {
      this.validatePrefix();
    },
    getTimestamp(timestamp) {
      return DateTime.fromISO(timestamp, { zone: "utc" }).toFormat("yyyy-MM-dd TTT");
    },
    fromNow(timestamp) {
      return DateTime.fromISO(timestamp, { zone: "utc" }).toRelative();
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
