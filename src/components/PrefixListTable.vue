<template>
  <div :class="{ 'prefix-list-table': true, warning: true }">
    <el-row v-if="enrichedData.prefixes.length > 1">
      <el-col :span="8" style="margin-left: 42px;">
        <el-input
          v-model="filterPrefix"
          placeholder="Filter on Prefix (regex allowed)"
          clearable
        />
      </el-col>
    </el-row>
    <el-table
      :data="
        enrichedData.prefixes.filter(
          data =>
            !this.filterPrefixValidatedRegExp ||
            data.prefix.match(this.filterPrefixValidatedRegExp)
        )
      "
      style="width: 100%"
      stripe
      :cell-class-name="r => (r.columnIndex === 1 && 'mono') || ''"
    >
      <el-table-column type="expand">
        <template v-slot:default="props">
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
                v-if="enrichedData.originAsn"
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
      <el-table-column prop="prefix" label="Prefix" sortable>
        <template v-slot:default="scope" style="position: relative;">
          <lmp-arrow v-if="scope.row.lmp && validateBgp" /><em-arrow
            v-if="scope.row.em && validateBgp"
          />{{ scope.row.prefix }}
        </template>
      </el-table-column>
      <el-table-column prop="bgp" label="BGP Origin ASN" sortable
        ><template v-slot:default="scope">
          <el-tag class="label" v-if="scope.row.bgp === 'NOT SEEN'" type="info"
            >NOT SEEN</el-tag
          >
          <span class="mono" v-else>{{ scope.row.bgp }}</span>
          <hand-drawn-box
            v-if="
              (scope.row.lmp || scope.row.em) &&
                validateBgp &&
                searchAsn === scope.row.bgp
            "
          /> </template
      ></el-table-column>
      <el-table-column
        prop="rpkiState"
        label="RPKI Status"
        sortable
        :sort-method="sortByRpkiStatus"
        ><template v-slot:default="scope"
          ><el-tag
            v-if="scope.row.rpki.state"
            :type="
              (scope.row.rpki.state === 'VALID' && 'success') ||
                (scope.row.rpki.state === 'INVALID' && 'danger') ||
                (scope.row.rpki.state === 'SERVER FAILURE' && 'danger') ||
                'warning'
            "
            >{{ scope.row.rpki.state }} {{ scope.row.reason }}</el-tag
          ></template
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import APIService from "@/services/APIService.js";
import ValidityTable from "@/components/ValidityTable";
import LmpArrow from "@/components/LmpArrow";
import EmArrow from "@/components/EmArrow";
import HandDrawnBox from "@/components/HandDrawnBox";
import Vue from "vue";

export default {
  components: {
    ValidityTable,
    LmpArrow,
    EmArrow,
    HandDrawnBox
  },
  name: "PrefixListTable",
  props: ["data", "searchAsn", "searchPrefix", "validateBgp"],
  created() {
    this.data.forEach(p => this.validateRelatedPrefix(p.bgp, p.prefix));
  },
  data() {
    return {
      enrichedData: {
        prefixes: this.data.map(p => ({
          ...p,
          rpki: {},
          rpkiDetails: {},
          lmp: p.type === "longest-match",
          em: p.type === "exact-match"
        })),
        originAsn: null
      },
      filterPrefix: "",
    };
  },
  computed: {
    filterPrefixValidatedRegExp: function() {
      let filterRegEx;
      try {
        filterRegEx = new RegExp(this.filterPrefix.replace(".", "\\."));
      } catch (e) {
        console.log("invalid regex");
      }
      return filterRegEx;
    }
  },
  methods: {
    validateRelatedPrefix(asn, prefix) {
      if (asn == "NOT SEEN") {
        return;
      }
      console.log(`validate ${prefix} for ${asn}`);
      APIService.checkValidity(asn, prefix)
        .then(
          r => {
            console.log(`validated ${prefix} for ${asn}`);
            if (r.data && r.data.validated_route) {
              let matched = r.data.validated_route.validity.VRPs.matched;
              let matchedAsn = (matched && matched.find(m => m.asn)) ||
                r.data.validated_route.validity.VRPs.unmatched_as || {
                  asn: null
                };
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
          },
          err => {
            console.log(
              `Routinator API call failed miserably for ${prefix} and ${asn}.`
            );
            let idx = this.enrichedData.prefixes.findIndex(
              p => p.prefix === prefix
            );
            Vue.set(this.enrichedData.prefixes, idx, {
              ...this.enrichedData.prefixes[idx],
              rpki: {
                originAsn: null,
                state: "SERVER FAILURE"
              },
              rpkiDetails: {}
            });
          }
        )
        .catch(err => {
          console.log("Routinator API returned an error");
          console.error(err);
        });
    },
    sortByRpkiStatus(a, b) {
      if (a.rpki.state && !b.rpki.state) {
        return 1;
      }
      return a.rpki.state > b.rpki.state;
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
