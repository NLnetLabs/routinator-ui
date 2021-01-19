<template>
  <div class="tal">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <h4>
          <img :src="getImage(label)" class="rir" />
          {{ label }}
        </h4>
      </div>

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
        <div class="value">{{ data.vrpsFilteredLocally }}</div>
      </div>

      <div class="group">
        <strong>{{ $t("tal.duplicate") }}</strong>
        <div class="value">{{ data.vrpsDuplicate }}</div>
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
    }
  }
};
</script>

<style lang="scss" scoped>
.tal {
  margin-top: 1rem;
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
</style>
