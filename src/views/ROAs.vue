<template>
  <div>
    <el-card>
      <div v-if="loadingROAs" class="loading">
        <i class="el-icon-loading"></i>
        {{ $t("roas.loading") }}
      </div>

      <div v-if="!loadingROAs">
        <el-table :data="filteredROAs" style="width: 100%" :empty-text="$t('common.nodata')">
          <el-table-column fixed :label="$t('common.asn')" width="250">
            <template slot-scope="scope">
              <a
                :href="
                  '#/' + scope.row.asn.substr(2) + '/' + scope.row.prefix.replace(/\//gi, '%2F')
                "
                target="_blank"
                >{{ scope.row.asn }}</a
              >
            </template>
          </el-table-column>
          <el-table-column prop="prefix" :label="$t('common.prefix')" width="300">
          </el-table-column>
          <el-table-column prop="maxLength" :label="$t('common.maxlength')" width="150">
          </el-table-column>
          <el-table-column prop="ta" :label="$t('common.ta')"> </el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                clearable
                placeholder="Type to search"
                @input="preFilterROAs"
              />
            </template>
            <template slot-scope="scope"> &nbsp; </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          :current-page.sync="currentPage"
          :page-sizes="[10, 25, 50, 100]"
          :page-size="pageSize"
          :hide-on-single-page="true"
          @current-change="preFilterROAs"
          @size-change="changeSize"
          layout="prev, pager, next, sizes"
          :total="totalRecords"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";

export default {
  data() {
    return {
      loadingROAs: false,
      roas: [],
      filteredROAs: [],
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      search: "",
    };
  },
  created() {
    this.loadingROAs = true;
    setTimeout(() => {
      this.loadROAs();
    }, 250);
  },
  methods: {
    loadROAs() {
      APIService.getROAs().then((response) => {
        if (response.data && response.data.roas) {
          this.roas = response.data.roas;
        }
        this.preFilterROAs();
      });

      return false;
    },
    debounce: function (func, wait = 100) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        func.apply(this);
      }, wait);
    },
    changeSize: function (size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.preFilterROAs();
    },
    preFilterROAs: function () {
      this.debounce(this.filterROAs, 200);
    },
    filterROAs: function () {
      const self = this;
      let filtered = this.roas.filter(function (roa) {
        return roa.asn.toLowerCase().indexOf(self.search) > -1;
      });
      this.totalRecords = filtered.length;
      this.filteredROAs = filtered.slice(
        (this.currentPage - 1) * this.pageSize,
        Math.min(this.roas.length, this.currentPage * this.pageSize)
      );
      this.loadingROAs = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  padding: 3rem;
  text-align: center;
  color: #999;
}
.el-pagination {
  margin-top: 2rem;
}
</style>
