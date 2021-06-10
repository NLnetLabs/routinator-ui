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
            <el-form :inline="true" :model="searchForm">
              <el-form-item :label="$t('home.origin')">
                <el-input
                  v-model="searchForm.asn"
                  placeholder="e.g. 64511"
                  clearable
                  @keyup.enter.native="validateAnnouncement"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.prefix')">
                <el-input
                  v-model="searchForm.prefix"
                  placeholder="e.g. 192.0.2.0/24"
                  clearable
                  @keyup.enter.native="validateAnnouncement"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="validateAnnouncement">{{
                  $t("home.validate")
                }}</el-button>
              </el-form-item>
            </el-form>
            <el-tag size="mini" type="danger" v-if="error">{{ error }}</el-tag>
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
import * as moment from "moment";

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
    validateAnnouncement() {
      this.validatePrefix();
    },
    getTimestamp(timestamp) {
      return moment.utc(timestamp).format() + " UTC";
    },
    fromNow(timestamp) {
      return moment.utc(timestamp).fromNow();
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
</style>
