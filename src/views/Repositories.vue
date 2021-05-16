<template>
  <div>
    <el-card>
      <div v-if="loading" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("common.loading") }}
      </div>

      <div v-if="!loading">
        <el-table :data="repositories" style="width: 100%" height="calc(100vh - 200px)" stripe>
          <el-table-column fixed :label="$t('repositories.repository')" width="250">
            <template slot-scope="scope">
              <a :href="scope.row.repo" target="_blank">{{ scope.row.repo }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="$t('repositories.type')" width="150" sortable>
          </el-table-column>
          <el-table-column
            prop="vrpsTotal"
            :label="$t('repositories.vrpsTotal')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsUnsafe"
            :label="$t('repositories.vrpsUnsafe')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsLocallyFiltered"
            :label="$t('repositories.vrpsLocallyFiltered')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsDuplicate"
            :label="$t('repositories.vrpsDuplicate')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="vrpsFinal"
            :label="$t('repositories.vrpsFinal')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validPublicationPoints"
            :label="$t('repositories.validPublicationPoints')"
            width="200"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="rejectedPublicationPoints"
            :label="$t('repositories.rejectedPublicationPoints')"
            width="220"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validManifests"
            :label="$t('repositories.validManifests')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidManifests"
            :label="$t('repositories.invalidManifests')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="staleManifests"
            :label="$t('repositories.staleManifests')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="missingManifests"
            :label="$t('repositories.missingManifests')"
            width="180"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validCRLs"
            :label="$t('repositories.validCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidCRLs"
            :label="$t('repositories.invalidCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="staleCRLs"
            :label="$t('repositories.staleCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="strayCRLs"
            :label="$t('repositories.strayCRLs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validCACerts"
            :label="$t('repositories.validCACerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validEECerts"
            :label="$t('repositories.validEECerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidCerts"
            :label="$t('repositories.invalidCerts')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validROAs"
            :label="$t('repositories.validROAs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidROAs"
            :label="$t('repositories.invalidROAs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="validGBRs"
            :label="$t('repositories.validGBRs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="invalidGBRs"
            :label="$t('repositories.invalidGBRs')"
            width="150"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="otherObjects"
            :label="$t('repositories.otherObjects')"
            width="150"
            sortable
          >
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";

export default {
  data() {
    return {
      loading: false,
      repositories: [],
    };
  },
  created() {
    this.loadStatus();
  },
  methods: {
    loadStatus() {
      this.loading = true;
      APIService.getStatus().then((response) => {
        this.status = response.data;
        this.loading = false;
        if (this.status && this.status.version) {
          this.$emit("update-version", this.status.version);
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
  },
};
</script>

<style lang="scss" scoped>
</style>
