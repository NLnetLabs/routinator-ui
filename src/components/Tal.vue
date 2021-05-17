<template>
  <div class="tal">
    <el-card shadow="never" :class="{ 'tal-card': detailed }">
      <div slot="header" class="clearfix">
        <h4>
          <img :src="getImage(label)" class="rir" />
          {{ label }}
        </h4>
      </div>

      <div v-if="!detailed">
        <div class="group">
          <strong>{{ $t("tal.valid") }}</strong>
          <div class="value">{{ data.validROAs }}</div>
        </div>

        <div class="group">
          <strong>{{ $t("tal.final") }}</strong>
          <div class="value">{{ data.vrpsFinal }}</div>
        </div>

        <div class="group">
          <strong>{{ $t("tal.unsafe") }}</strong>
          <div class="value">{{ data.vrpsUnsafe }}</div>
        </div>

        <div class="group">
          <strong>{{ $t("tal.filtered") }}</strong>
          <div class="value">{{ data.vrpsLocallyFiltered }}</div>
        </div>

        <div class="group">
          <strong>{{ $t("tal.duplicate") }}</strong>
          <div class="value">{{ data.vrpsDuplicate }}</div>
        </div>
      </div>

      <div v-if="detailed">
        <div class="group-name">
          <strong>{{ $t("tal-detailed.ROAs") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.valid") }}</strong>
              <div class="value">{{ data.validROAs }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.invalid") }}</strong>
              <div class="value">{{ data.invalidROAs }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.VRPs") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.total") }}</strong>
              <div class="value">{{ data.vrpsTotal }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.unsafe") }}</strong>
              <div class="value">{{ data.vrpsUnsafe }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.duplicate") }}</strong>
              <div class="value">{{ data.vrpsDuplicate }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.final") }}</strong>
              <div class="value">{{ data.vrpsFinal }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.locallyFiltered") }}</strong>
              <div class="value">{{ data.vrpsLocallyFiltered }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.publicationPoints") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.valid") }}</strong>
              <div class="value">{{ data.validPublicationPoints }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.rejected") }}</strong>
              <div class="value">{{ data.rejectedPublicationPoints }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.manifests") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.valid") }}</strong>
              <div class="value">{{ data.validManifests }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.invalid") }}</strong>
              <div class="value">{{ data.invalidManifests }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.stale") }}</strong>
              <div class="value">{{ data.staleManifests }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.missing") }}</strong>
              <div class="value">{{ data.missingManifests }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.CRLs") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.valid") }}</strong>
              <div class="value">{{ data.validCRLs }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.invalid") }}</strong>
              <div class="value">{{ data.invalidCRLs }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.stale") }}</strong>
              <div class="value">{{ data.staleCRLs }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.stray") }}</strong>
              <div class="value">{{ data.strayCRLs }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.certs") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.validCA") }}</strong>
              <div class="value">{{ data.validCACerts }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.validEE") }}</strong>
              <div class="value">{{ data.validEECerts }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.invalid") }}</strong>
              <div class="value">{{ data.invalidCerts }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.GBRs") }}</strong>
        </div>
        <el-row>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.valid") }}</strong>
              <div class="value">{{ data.validGBRs }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="group group-detailed">
              <strong>{{ $t("tal-detailed.invalid") }}</strong>
              <div class="value">{{ data.invalidGBRs }}</div>
            </div>
          </el-col>
        </el-row>

        <div class="group-name">
          <strong>{{ $t("tal-detailed.otherObjects") }}</strong>
        </div>
        <div class="group">
          <div class="value">{{ data.otherObjects }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Tal",
  props: ["label", "data", "detailed"],
  data() {
    return {};
  },
  methods: {
    getImage(label) {
      let image = "blue.svg";
      if (label.toLowerCase().indexOf("afrinic") > -1) {
        image = "afrinic.svg";
      }
      if (label.toLowerCase().indexOf("arin") > -1) {
        image = "arin.svg";
      }
      if (label.toLowerCase().indexOf("apnic") > -1) {
        image = "apnic.svg";
      }
      if (label.toLowerCase().indexOf("ripe") > -1) {
        image = "ripencc.svg";
      }
      if (label.toLowerCase().indexOf("lacnic") > -1) {
        image = "lacnic.svg";
      }
      return require("@/assets/images/" + image);
    },
  },
};
</script>

<style lang="scss" scoped>
.tal {
  margin-top: 1rem;
}
.tal-card {
  margin: 1rem;
}
h4 {
  margin: 0;
  text-transform: uppercase;
}
.rir {
  border-radius: 1rem;
  width: 2rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}
.group {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  .value {
    font-style: italic;
  }
}
.group-detailed {
  color: #999;
}
.group-name {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.2rem;
  font-size: 0.9rem;
}
</style>
