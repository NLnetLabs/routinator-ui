<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <h4>
          <img :src="require('@/assets/images/' + image)" class="rir" />
          {{ label }}
        </h4>
      </div>

      <div class="group">
        <strong>Valid ROAs</strong>
        <div class="value">{{ data.validROAs }}</div>
      </div>

      <div class="group">
        <strong>Final VRPS</strong>
        <div class="value">{{ data.vrpsFinal }}</div>
      </div>

      <div class="group">
        <strong>Unsafe VRPS</strong>
        <div class="value">{{ data.vrpsUnsafe }}</div>
      </div>

      <div class="group">
        <strong>VRPS Filtered Locally</strong>
        <div class="value">{{ data.vrpsFilteredLocally }}</div>
      </div>

      <div class="group">
        <strong>Duplicate VRPS</strong>
        <div class="value">{{ data.vrpsDuplicate }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Tal",
  props: ["image", "label", "data"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
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
