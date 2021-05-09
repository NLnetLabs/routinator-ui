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
        {{ $t("home.loading") }}
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
      {{ $t("home.loading") }}
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
      <el-col :span="8" v-for="(tal, index) in Object.keys(status.tals)" :key="index">
        <tal :label="tal" :data="status.tals[tal]" />
      </el-col>
    </el-row>

    <el-collapse v-if="status && status.serial !== null" class="airy stats">
      <el-collapse-item :title="$t('home.repositories')">
        <el-table :data="repositories" style="width: 100%" height="250">
          <el-table-column fixed :label="$t('home.repotable.repository')" width="250">
            <template slot-scope="scope">
              <a :href="scope.row.repo" target="_blank">{{ scope.row.repo }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('home.repotable.type')" width="150" sortable>
          </el-table-column>
          <el-table-column
            prop="vrpsTotal"
            :label="$t('home.repotable.vrpsTotal')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsUnsafe"
            :label="$t('home.repotable.vrpsUnsafe')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsLocallyFiltered"
            :label="$t('home.repotable.vrpsLocallyFiltered')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsDuplicate"
            :label="$t('home.repotable.vrpsDuplicate')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsFinal"
            :label="$t('home.repotable.vrpsFinal')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validPublicationPoints"
            :label="$t('home.repotable.validPublicationPoints')"
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="rejectedPublicationPoints"
            :label="$t('home.repotable.rejectedPublicationPoints')"
            width="220"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validManifests"
            :label="$t('home.repotable.validManifests')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidManifests"
            :label="$t('home.repotable.invalidManifests')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="staleManifests"
            :label="$t('home.repotable.staleManifests')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="missingManifests"
            :label="$t('home.repotable.missingManifests')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validCRLs"
            :label="$t('home.repotable.validCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidCRLs"
            :label="$t('home.repotable.invalidCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="staleCRLs"
            :label="$t('home.repotable.staleCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="strayCRLs"
            :label="$t('home.repotable.strayCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validCACerts"
            :label="$t('home.repotable.validCACerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validEECerts"
            :label="$t('home.repotable.validEECerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidCerts"
            :label="$t('home.repotable.invalidCerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validROAs"
            :label="$t('home.repotable.validROAs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidROAs"
            :label="$t('home.repotable.invalidROAs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validGBRs"
            :label="$t('home.repotable.validGBRs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidGBRs"
            :label="$t('home.repotable.invalidGBRs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="otherObjects"
            :label="$t('home.repotable.otherObjects')"
            width="150"
            sortable
          >
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item :title="$t('home.extrastats')">
        <el-row>
          <el-col :span="4"> RRDP </el-col>
          <el-col :span="20">
            <el-table :data="rrdp" style="width: 100%" stripe height="250">
              <el-table-column fixed label="URL" width="300">
                <template slot-scope="scope"
                  ><a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a></template
                >
              </el-table-column>
              <el-table-column prop="status" :label="$t('home.status')" width="150">
              </el-table-column>
              <el-table-column :label="$t('home.duration')" width="150"
                ><template slot-scope="scope">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="3"
                    :percentage="(scope.row.duration / rrdpMax) * 100"
                  ></el-progress> </template
              ></el-table-column>
              <el-table-column label="" width="150">
                <template slot-scope="scope"> {{ scope.row.duration }}s </template>
              </el-table-column>
              <el-table-column prop="notifyStatus" :label="$t('home.notifyStatus')" width="150">
              </el-table-column>
              <el-table-column prop="payloadStatus" :label="$t('home.payloadStatus')" width="150">
              </el-table-column>
              <el-table-column prop="serial" :label="$t('home.serial')" width="150">
              </el-table-column>
              <el-table-column prop="delta" :label="$t('home.delta')" width="150">
              </el-table-column>
              <el-table-column
                prop="snapshot_reason"
                :label="$t('home.snapshotReason')"
                width="150"
              >
              </el-table-column>
              <el-table-column prop="session" :label="$t('home.session')" width="350">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"> RSYNC </el-col>
          <el-col :span="20">
            <el-table :data="rsync" style="width: 100%" stripe height="250">
              <el-table-column prop="url" label="URL" width="300"> </el-table-column>
              <el-table-column prop="status" :label="$t('home.status')" width="150">
              </el-table-column>
              <el-table-column :label="$t('home.duration')" width="150"
                ><template slot-scope="scope">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="3"
                    :percentage="(scope.row.duration / rsyncMax) * 100"
                  ></el-progress> </template
              ></el-table-column>
              <el-table-column label="">
                <template slot-scope="scope"> {{ scope.row.duration }}s </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            {{ $t("home.serial") }}
          </el-col>
          <el-col :span="20">
            {{ status.serial }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            {{ $t("home.lastupdatestart") }}
          </el-col>
          <el-col :span="20">
            {{ status.lastUpdateStart }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            {{ $t("home.lastupdateend") }}
          </el-col>
          <el-col :span="20">
            {{ status.lastUpdateDone }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            {{ $t("home.lastupdateduration") }}
          </el-col>
          <el-col :span="20"> {{ status.lastUpdateDuration }} {{ $t("home.seconds") }} </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            {{ $t("home.vrpsaddedlocally") }}
          </el-col>
          <el-col :span="20">
            {{ status.vrpsAddedLocally }}
          </el-col>
        </el-row>

        <el-row v-if="status.rtr">
          <el-col :span="4"> RTR </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                {{ $t("home.totalconnections") }}
              </el-col>
              <el-col :span="20">
                {{ status.rtr.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.currentconnections") }}
              </el-col>
              <el-col :span="20">
                {{ status.rtr.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.bytesread") }}
              </el-col>
              <el-col :span="20">
                {{ status.rtr.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.byteswritten") }}
              </el-col>
              <el-col :span="20">
                {{ status.rtr.bytesWritten }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="status.http">
          <el-col :span="4"> HTTP </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                {{ $t("home.totalconnections") }}
              </el-col>
              <el-col :span="20">
                {{ status.http.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.currentconnections") }}
              </el-col>
              <el-col :span="20">
                {{ status.http.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.requests") }}
              </el-col>
              <el-col :span="20">
                {{ status.http.requests }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.bytesread") }}
              </el-col>
              <el-col :span="20">
                {{ status.http.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("home.byteswritten") }}
              </el-col>
              <el-col :span="20">
                {{ status.http.bytesWritten }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
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
    ValidityTable,
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
        prefix: "",
      },
      error: "",
      rsync: [],
      rrdp: [],
      repositories: [],
    };
  },
  created() {
    this.loadRoute();
    this.loadStatus();
  },
  watch: {
    $route() {
      this.loadRoute();
    },
  },
  computed: {
    rrdpMax() {
      return Math.max.apply(
        Math,
        this.rrdp.map(function (u) {
          return u.duration;
        })
      );
    },
    rsyncMax() {
      return Math.max.apply(
        Math,
        this.rsync.map(function (u) {
          return u.duration;
        })
      );
    },
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
      APIService.getStatus().then((response) => {
        this.status = response.data;
        this.loadingStatus = false;
        if (this.status && this.status.version) {
          this.$emit("update-version", this.status.version);
        }
        if (this.status.rsync) {
          let rsync = [];
          Object.keys(this.status.rsync).forEach((k) => {
            rsync.push({
              duration: this.status.rsync[k].duration,
              status: this.status.rsync[k].status,
              url: k,
            });
          });
          this.rsync = rsync;
        }
        if (this.status.rrdp) {
          let rrdp = [];
          Object.keys(this.status.rrdp).forEach((k) => {
            rrdp.push({
              ...this.status.rrdp[k],
              url: k,
            });
          });
          this.rrdp = rrdp;
        }
        if (this.status.repositories) {
          let repos = [];
          Object.keys(this.status.repositories).forEach((k) => {
            repos.push({
              repo: k,
              ...this.status.repositories[k],
            });
          });
          this.repositories = repos;
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
        this.error = "";
      } else {
        this.error = this.$t("home.validasn");
        return;
      }
      let prefixValid = false;
      let prefixValue = this.searchForm.prefix;
      if (cidrRegex({ exact: true }).test(prefixValue)) {
        prefixValid = true;
        this.error = "";
      } else {
        this.error = this.$t("home.validprefix");
        return;
      }

      if (asValid && prefixValid) {
        this.loadingRoute = true;
        this.firstSearch = false;
        APIService.checkValidity(this.searchForm.asn, this.searchForm.prefix).then((response) => {
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
    },
  },
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
.stats {
  .el-row {
    color: #999 !important;
    margin-bottom: 1rem;
  }
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
