<template>
  <div>
    <el-card>
      <div v-if="loading" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("common.loading") }}
      </div>

      <div v-if="!loading && status && status.serial !== null" class="stats">
        <el-row class="table-row">
          <el-col :span="4" class="title"> RRDP </el-col>
          <el-col :span="20">
            <el-table
              :data="rrdp"
              style="width: 100%"
              stripe
              height="250"
              row-class-name="mono"
            >
              <el-table-column fixed label="URL" width="330">
                <template v-slot:default="scope"
                  ><a
                    :href="scope.row.url"
                    target="_blank"
                    class="sans-serif"
                    >{{ scope.row.url }}</a
                  ></template
                >
              </el-table-column>
              <el-table-column
                prop="status"
                :label="$t('connections.status')"
                width="150"
              >
              </el-table-column>
              <el-table-column :label="$t('connections.duration')" width="150"
                ><template v-slot:default="scope">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="3"
                    :percentage="(scope.row.duration / rrdpMax) * 100"
                  ></el-progress> </template
              ></el-table-column>
              <el-table-column label="" width="150">
                <template v-slot:default="scope">
                  {{ scope.row.duration }}s
                </template>
              </el-table-column>
              <el-table-column
                prop="notifyStatus"
                :label="$t('connections.notifyStatus')"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="payloadStatus"
                :label="$t('connections.payloadStatus')"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="serial"
                :label="$t('connections.serial')"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="delta"
                :label="$t('connections.delta')"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="snapshot_reason"
                :label="$t('connections.snapshotReason')"
                width="150"
              >
              </el-table-column>
              <el-table-column
                prop="session"
                :label="$t('connections.session')"
                width="350"
              >
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row class="table-row">
          <el-col :span="4" class="title"> RSYNC </el-col>
          <el-col :span="20">
            <el-table
              :data="rsync"
              style="width: 100%"
              stripe
              height="250"
              row-class-name="mono"
            >
              <el-table-column prop="url" label="URL" width="340"
                ><template v-slot:default="scope"
                  ><span class="sans-serif">{{
                    scope.row.url
                  }}</span></template
                >
              </el-table-column>
              <el-table-column
                prop="status"
                :label="$t('connections.status')"
                width="150"
              >
              </el-table-column>
              <el-table-column :label="$t('connections.duration')" width="150"
                ><template v-slot:default="scope">
                  <el-progress
                    :text-inside="true"
                    :stroke-width="3"
                    :percentage="(scope.row.duration / rsyncMax) * 100"
                  ></el-progress> </template
              ></el-table-column>
              <el-table-column label="">
                <template v-slot:default="scope">
                  {{ scope.row.duration }}s
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4" class="title">
            {{ $t("connections.serial") }}
          </el-col>
          <el-col :span="20" class="mono">
            {{ status.serial }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">
            {{ $t("connections.lastupdatestart") }}
          </el-col>
          <el-col :span="20" class="mono">
            {{ formatDateTimeString(status.lastUpdateStart) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">
            {{ $t("connections.lastupdateend") }}
          </el-col>
          <el-col :span="20" class="mono">
            {{ formatDateTimeString(status.lastUpdateDone) }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="title">
            {{ $t("connections.lastupdateduration") }}
          </el-col>
          <el-col :span="20" class="mono">
            {{ status.lastUpdateDuration }} {{ $t("connections.seconds") }}
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4" class="title">
            {{ $t("connections.vrpsaddedlocally") }}
          </el-col>
          <el-col :span="20" class="mono">
            {{ status.vrpsAddedLocally }}
          </el-col>
        </el-row>

        <el-row v-if="status.rtr">
          <el-col :span="4" class="title"> RTR </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                {{ $t("connections.totalconnections") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.rtr.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.currentconnections") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.rtr.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.bytesread") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.rtr.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.byteswritten") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.rtr.bytesWritten }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row v-if="status.http">
          <el-col :span="4" class="title"> HTTP </el-col>
          <el-col :span="20">
            <el-row>
              <el-col :span="4">
                {{ $t("connections.totalconnections") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.http.totalConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.currentconnections") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.http.currentConnections }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.requests") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.http.requests }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.bytesread") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.http.bytesRead }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4">
                {{ $t("connections.byteswritten") }}
              </el-col>
              <el-col :span="20" class="mono">
                {{ status.http.bytesWritten }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import { DateTime } from "luxon";

export default {
  data() {
    return {
      loading: false,
      status: {},
      rsync: [],
      rrdp: []
    };
  },
  created() {
    this.loadStatus();
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
    loadStatus() {
      this.loading = true;
      APIService.getStatus().then(response => {
        this.status = response.data;
        this.loading = false;
        if (this.status && this.status.version) {
          this.$emit("update-version", this.status.version);
        }
        if (this.status.rsync) {
          let rsync = [];
          Object.keys(this.status.rsync).forEach(k => {
            rsync.push({
              url: k,
              ...this.status.rsync[k]
            });
          });
          this.rsync = rsync;
        }
        if (this.status.rrdp) {
          let rrdp = [];
          Object.keys(this.status.rrdp).forEach(k => {
            rrdp.push({
              url: k,
              ...this.status.rrdp[k]
            });
          });
          this.rrdp = rrdp;
        }
      });

      return false;
    },
    formatDateTimeString(DTString) {
      return DateTime.fromISO(DTString, { zone: "utc" }).toFormat(
        "yyyy-MM-dd TTT"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.stats {
  .el-row {
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  .title {
    font-weight: bold;
  }
  .table-row {
    margin-bottom: 4rem;
    .title {
      margin-top: 1rem;
    }
  }
}
</style>
