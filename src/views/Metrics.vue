<template>
  <div>
    <el-card>
      <div v-if="loading" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("common.loading") }}
      </div>

      <div v-if="!loading">
        <el-row v-if="status && status.tals">
          <el-col :span="8" v-for="(tal, index) in Object.keys(status.tals)" :key="index">
            <tal :label="tal" :data="status.tals[tal]" :detailed="true" />
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import Tal from "@/components/Tal";

export default {
  components: {
    Tal,
  },
  data() {
    return {
      loading: false,
      status: {},
    };
  },
  created() {
    this.loadRoutinatorStatus();
  },
  methods: {
    loadRoutinatorStatus() {
      this.loading = true;
      APIService.getRoutinatorStatus().then((response) => {
        this.status = response.data;
        this.loading = false;
        if (this.status && this.status.version) {
          this.$emit("update-version", this.status.version);
        }
      });

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
