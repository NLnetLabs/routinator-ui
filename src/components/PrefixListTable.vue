<template>
  <div :class="{ 'prefix-list-table': true, warning: true }">
    <el-table :data="stringlyData" style="width: 100%" stripe>
      <el-table-column prop="prefix" label="Prefix"></el-table-column>
      <el-table-column prop="rir" label="RIR Allocation"></el-table-column>
      <el-table-column prop="bgp" label="BGP"></el-table-column>
      <el-table-column prop="rpki" label="RPKI"> </el-table-column>
      <el-table-column prop="rpkiState" label="RPKI STATUS"
        ><template slot-scope="scope"
          ><el-tag :type="scope.row.state === 'VALID' ? 'success' : 'warning'"
            >{{ scope.row.state }} {{ scope.row.reason }}</el-tag
          ></template
        ></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
export default {
  name: "PrefixListTable",
  props: ["data"],
  data() {
    return {
      stringlyData: this.data.map(d => {
        let matched = d.results.rpki.validity.VRPs.matched;

        let matchedAsn = (matched && matched.find(m => m.asn)) ||
          d.results.rpki.validity.VRPs.unmatched_as || { asn: null };

        return {
          prefix: d.prefix,
          rir: d.results.rir_alloc.rir.toUpperCase(),
          bgp: d.results.bgp && d.results.bgp.origin_asn || "NOT FOUND",
          rpki: matchedAsn.asn || "NOT FOUND",
          state: d.results.rpki.validity.state
            .toUpperCase()
            .replace("-", " "),
          reason: null
        };
      })
    };
  },
  methods: {
    getValidationASN() {
      console.log(this.data);
      return this.data.results.rpki.validity.VRPs.values().find(r => r.asn);
    }
  }
};
</script>

<style lang="scss" scoped>
.validity-table {
  margin-top: 2rem;
  .el-table {
    border-left: 2px solid #e1f3d8;
  }
  &.warning {
    .el-table {
      border-color: #faecd8;
    }
  }
  .el-tag {
    border-bottom-left-radius: 0;
  }
}
</style>
