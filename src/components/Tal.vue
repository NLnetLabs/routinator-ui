<template>
  <div class="tal">
    <el-card shadow="never" class="tal-card">
      <div slot="header" class="clearfix">
        <h4>
          <img :src="getImage(label)" class="rir" />
          {{ label }}
        </h4>
      </div>

      <div class="group-name">
        <strong>{{ $t("tal.ROAs") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.valid") }}</strong>
            <div class="value">{{ data.validROAs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.invalid") }}</strong>
            <div class="value">{{ data.invalidROAs }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.VRPs") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.total") }}</strong>
            <div class="value">{{ data.vrpsTotal }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.unsafe") }}</strong>
            <div class="value">{{ data.vrpsUnsafe }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.duplicate") }}</strong>
            <div class="value">{{ data.vrpsDuplicate }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.final") }}</strong>
            <div class="value">{{ data.vrpsFinal }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.locallyFiltered") }}</strong>
            <div class="value">{{ data.vrpsLocallyFiltered }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.publicationPoints") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.valid") }}</strong>
            <div class="value">{{ data.validPublicationPoints }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.rejected") }}</strong>
            <div class="value">{{ data.rejectedPublicationPoints }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.manifests") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.valid") }}</strong>
            <div class="value">{{ data.validManifests }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.invalid") }}</strong>
            <div class="value">{{ data.invalidManifests }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.stale") }}</strong>
            <div class="value">{{ data.staleManifests }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.missing") }}</strong>
            <div class="value">{{ data.missingManifests }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.CRLs") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.valid") }}</strong>
            <div class="value">{{ data.validCRLs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.invalid") }}</strong>
            <div class="value">{{ data.invalidCRLs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.stale") }}</strong>
            <div class="value">{{ data.staleCRLs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.stray") }}</strong>
            <div class="value">{{ data.strayCRLs }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.certs") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.validCA") }}</strong>
            <div class="value">{{ data.validCACerts }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.validEE") }}</strong>
            <div class="value">{{ data.validEECerts }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.invalid") }}</strong>
            <div class="value">{{ data.invalidCerts }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.GBRs") }}</strong>
      </div>
      <el-row>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.valid") }}</strong>
            <div class="value">{{ data.validGBRs }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="group">
            <strong>{{ $t("tal.invalid") }}</strong>
            <div class="value">{{ data.invalidGBRs }}</div>
          </div>
        </el-col>
      </el-row>

      <div class="group-name">
        <strong>{{ $t("tal.otherObjects") }}</strong>
      </div>
      <div class="group">
        <div class="value">{{ data.otherObjects }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Tal",
  props: ["label", "data"],
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
.group-name {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.2rem;
  font-size: 0.9rem;
}
.group {
  font-size: 0.8rem;
  margin-bottom: 1rem;
  color: #999;
  .value {
    font-style: italic;
  }
}
</style>
