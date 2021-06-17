<template>
  <div :class="{ 'prefix-list-table': true, warning: true }">
    <el-table :data="enrichedData.prefixes" style="width: 100%" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div v-if="props.row.rpkiDetails.state">
            <div v-if="props.row.rpkiDetails.state">
              <div class="validation-description">
                {{ props.row.rpkiDetails.description }}
              </div>

              <validity-table
                v-if="
                  props.row.rpkiDetails.VRPs &&
                    props.row.rpkiDetails.VRPs.matched.length
                "
                :label="$t('home.matched')"
                :isValid="true"
                :data="props.row.rpkiDetails.VRPs.matched"
              />
              <validity-table
                v-if="
                  props.row.rpkiDetails.VRPs &&
                    props.row.rpkiDetails.VRPs.unmatched_as.length
                "
                :label="$t('home.unmatchedasn')"
                :data="props.row.rpkiDetails.VRPs.unmatched_as"
              />
              <validity-table
                v-if="
                  props.row.rpkiDetails.VRPs &&
                    props.row.rpkiDetails.VRPs.unmatched_length.length
                "
                :label="$t('home.unmatchedlength')"
                :data="props.row.rpkiDetails.VRPs.unmatched_length"
              />
            </div>
          </div>
          <div v-else>
            <div>
              <el-button
                type="text"
                @click="
                  validateRelatedPrefix(
                    enrichedData.originAsn,
                    props.row.prefix
                  )
                "
                >Validate for {{ enrichedData.originAsn }}</el-button
              >
            </div>
            <div>
              <el-button
                type="text"
                v-if="searchAsn && enrichedData.originAsn !== searchAsn"
                @click="validateRelatedPrefix(searchAsn, props.row.prefix)"
                >Validate for {{ searchAsn }}</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="prefix" label="Prefix"></el-table-column>
      <el-table-column prop="bgp" label="BGP Origin ASN"
        ><template slot-scope="scope">
          <el-tag v-if="scope.row.bgp === 'NOT SEEN'" type="info"
            >NOT SEEN</el-tag
          >
          <span v-else>{{ scope.row.bgp }}</span>
        </template></el-table-column
      >
      <el-table-column prop="rpkiState" label="RPKI STATUS"
        ><template slot-scope="scope"
          ><el-tag
            v-if="scope.row.rpki.state"
            :type="
              (scope.row.rpki.state === 'VALID' && 'success') ||
                (scope.row.rpki.state === 'INVALID' && 'danger') ||
                'warning'
            "
            >{{ scope.row.rpki.state }} {{ scope.row.reason }}</el-tag
          ></template
        ></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import ValidityTable from "@/components/ValidityTable";
import Vue from "vue";

export default {
  components: {
    ValidityTable
  },
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
          this.enrichedData.originAsn =
            matchedAsn.asn || this.enrichedData.originAsn;
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
.validation-description {
  font-style: italic;
  margin-top: 0.6rem;
  font-size: 16px;
}
</style>
