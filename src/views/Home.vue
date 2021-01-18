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
              Welcome to Routinator 3000, the RPKI Relying Party software.
            </h3>
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="Origin ASN">
                <el-input v-model="searchForm.asn" placeholder="ie. 1234" clearable></el-input>
              </el-form-item>
              <el-form-item label="Prefix">
                <el-input
                  v-model="searchForm.prefix"
                  placeholder="ie. 0.0.0.0/24"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryAnnouncement">Query</el-button>
              </el-form-item>
            </el-form>
            <div class="spacer" v-if="firstSearch">&nbsp;</div>
          </div>
        </el-col>
      </el-row>

      <div v-if="loadingRoute" class="loading">
        <i class="el-icon-loading"></i>
        Loading...
      </div>

      <div v-if="validation && validation.route">
        <h4 class="header validation-header">
          Results for ASN {{ validation.route.origin_asn }} - Prefix {{ validation.route.prefix }}
          <el-tag type="success" v-if="validation.validity.state === 'valid'">Valid</el-tag>
          <el-tag type="warning" v-if="validation.validity.state === 'invalid'"
            >Invalid {{ validation.validity.reason }}</el-tag
          >
        </h4>
        <div class="validation-description">{{ validation.validity.description }}</div>

        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.matched.length"
          label="Matched VRPs"
          :isValid="true"
          :data="validation.validity.VRPs.matched"
        />
        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.unmatched_as.length"
          label="Unmatched VRPs - ASN"
          :data="validation.validity.VRPs.unmatched_as"
        />
        <validity-table
          v-if="validation.validity.VRPs && validation.validity.VRPs.unmatched_length.length"
          label="Unmatched VRPs - Length"
          :data="validation.validity.VRPs.unmatched_length"
        />
      </div>
    </el-card>

    <div v-if="loadingStatus" class="loading">
      <i class="el-icon-loading"></i>
      Loading...
    </div>

    <el-row v-if="status && status.tals" class="airy">
      <el-col :span="4">
        <tal label="Afrinic" image="afrinic.svg" :data="status.tals.afrinic" />
      </el-col>
      <el-col :span="4" :offset="1">
        <tal label="Apnic" image="apnic.svg" :data="status.tals.apnic" />
      </el-col>
      <el-col :span="4" :offset="1">
        <tal label="ARIN" image="arin.svg" :data="status.tals.arin" />
      </el-col>
      <el-col :span="4" :offset="1">
        <tal label="Lacnic" image="lacnic.svg" :data="status.tals.lacnic" />
      </el-col>
      <el-col :span="4" :offset="1">
        <tal label="RIPE NCC" image="ripencc.svg" :data="status.tals.ripe" />
      </el-col>
    </el-row>

    <el-collapse v-if="status && status.serial" class="airy stats">
      <el-collapse-item title="Extra stats">
        <el-row>
          <el-col :span="4">
            RRDP
          </el-col>
          <el-col :span="20">
            <el-table :data="rrdp" style="width: 100%" stripe height="250">
              <el-table-column label="URL">
                <template slot-scope="scope"
                  ><a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a></template
                >
              </el-table-column>
              <el-table-column prop="status" label="Status"> </el-table-column>
              <el-table-column label="Duration"
                ><template slot-scope="scope">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="3"
                    :percentage="(scope.row.duration / rrdpMax) * 100"
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
            RSYNC
          </el-col>
          <el-col :span="20">
            <el-table :data="rsync" style="width: 100%" stripe height="250">
              <el-table-column prop="url" label="URL"> </el-table-column>
              <el-table-column prop="status" label="Status"> </el-table-column>
              <el-table-column label="Duration"
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
            Serial
          </el-col>
          <el-col :span="20">
            {{ status.serial }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            Last Update Start
          </el-col>
          <el-col :span="20">
            {{ status.lastUpdateStart }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            Last Update End
          </el-col>
          <el-col :span="20">
            {{ status.lastUpdateDone }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            Last Update Duration
          </el-col>
          <el-col :span="20"> {{ status.lastUpdateDuration }} seconds </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            VRPS Added Locally
          </el-col>
          <el-col :span="20">
            {{ status.vrpsAddedLocally }}
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            Stale Object
          </el-col>
          <el-col :span="20">
            {{ status.staleObjects }}
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            RTR
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                Total Connections
              </el-col>
              <el-col :span="20">
                {{ status.rtr.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Current Connections
              </el-col>
              <el-col :span="20">
                {{ status.rtr.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Bytes Read
              </el-col>
              <el-col :span="20">
                {{ status.rtr.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Bytes Written
              </el-col>
              <el-col :span="20">
                {{ status.rtr.bytesWritten }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            HTTP
          </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                Total Connections
              </el-col>
              <el-col :span="20">
                {{ status.http.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Current Connections
              </el-col>
              <el-col :span="20">
                {{ status.http.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Requests
              </el-col>
              <el-col :span="20">
                {{ status.http.requests }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Bytes Read
              </el-col>
              <el-col :span="20">
                {{ status.http.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                Bytes Written
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
      rsync: [],
      rrdp: []
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
  computed: {
    rrdpMax() {
      return Math.max.apply(
        Math,
        this.rrdp.map(function(u) {
          return u.duration;
        })
      );
    },
    rsyncMax() {
      return Math.max.apply(
        Math,
        this.rsync.map(function(u) {
          return u.duration;
        })
      );
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
        if (this.status.rsync) {
          let rsync = [];
          Object.keys(this.status.rsync).forEach(k => {
            rsync.push({
              duration: this.status.rsync[k].duration,
              status: this.status.rsync[k].status,
              url: k
            });
          });
          this.rsync = rsync;
        }
        if (this.status.rrdp) {
          let rrdp = [];
          Object.keys(this.status.rrdp).forEach(k => {
            rrdp.push({
              duration: this.status.rrdp[k].duration,
              status: this.status.rrdp[k].status,
              url: k
            });
          });
          this.rrdp = rrdp;
        }
      });

      return false;
    },
    validatePrefix() {
      // TODO: add validation
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
    },
    queryAnnouncement() {
      this.validatePrefix();
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
</style>
