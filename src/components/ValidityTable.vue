<template>
  <div :class="{ 'validity-table': true, warning: !isValid }">
    <el-tag :type="isValid ? 'success' : 'warning'" size="small">{{ label }}</el-tag>
    <el-table :data="data" style="width: 100%" stripe>
      <el-table-column prop="asn" label="ASN"> </el-table-column>
      <el-table-column prop="prefix" label="Prefix"> </el-table-column>
      <el-table-column prop="max_length" label="Max Length"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ValidityTable",
  props: ["label", "data", "isValid"],
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.validity-table {
  margin-top: 2rem;
  .el-table {
    border-left: 4px solid #f0f9eb;
  }
  &.warning {
    .el-table {
      border-color: #fdf6ec;
    }
  }
}
</style>
