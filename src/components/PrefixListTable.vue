<template>
  <div :class="{ 'prefix-list-table': true, warning: true }">
    <el-table :data="enrichedData.prefixes" style="width: 100%" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <p v-if="props.row.rpkiDetails.state">{{ props.row.rpkiDetails }}</p>
          <div v-else>
            <el-button type="text"
              >validate for {{ enrichedData.originAsn }}</el-button
            >
            <el-button type="text"
              >validate for {{ searchAsn }}</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="prefix" label="Prefix"></el-table-column>
      <el-table-column prop="bgp" label="BGP Origin ASN"></el-table-column>
      <el-table-column prop="rpkiState" label="RPKI STATUS"
        ><template slot-scope="scope"
          ><el-tag
            v-if="scope.row.rpki.state"
            :type="scope.row.rpki.state === 'VALID' ? 'success' : 'warning'"
            >{{ scope.row.rpki.state }} {{ scope.row.reason }}</el-tag
          ></template
        ></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import Vue from "vue";

export default {
  name: "PrefixListTable",
  props: ["data", "searchAsn"],
  created() {
    this.data.forEach(p => this.validateRelatedPrefix(p.bgp, p.prefix));
  },
  data() {
    return {
      enrichedData: {
        prefixes: this.data.map(p => ({ ...p, rpki: {}, rpkiDetails: {} })),
        originAsn: null
      }
    };
  },
  methods: {
    validateRelatedPrefix(asn, prefix) {
      console.log(`validate ${prefix} for ${asn}`);
      if (asn == "NOT SEEN") {
        return;
      }
      APIService.checkValidity(asn, prefix).then(r => {
        console.log(`validated ${prefix} for ${asn}`);
        if (r.data && r.data.validated_route) {
          let matched = r.data.validated_route.validity.VRPs.matched;
          let matchedAsn = (matched && matched.find(m => m.asn)) ||
            r.data.validated_route.validity.VRPs.unmatched_as || { asn: null };
          let idx = this.enrichedData.prefixes.findIndex(
            p => p.prefix === prefix
          );
          this.enrichedData.originAsn = matchedAsn.asn;
          Vue.set(this.enrichedData.prefixes, idx, {
            ...this.enrichedData.prefixes[idx],
            rpki: {
              originAsn: matchedAsn.asn,
              state: r.data.validated_route.validity.state
                .toUpperCase()
                .replace("-", " ")
            },
            rpkiDetails: r.data.validated_route.validity
          });
        }
      });
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
