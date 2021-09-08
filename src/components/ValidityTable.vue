<template>
  <div :class="{ 'validity-table': true, warning: !isValid }">
    <el-tag :type="isValid ? 'success' : 'danger'" size="small">{{
      label
    }}</el-tag>
    <el-table
      :data="data"
      style="width: 100%"
      cell-class-name="mono"
      row-class-name=""
      stripe
    >
      <el-table-column prop="prefix" :label="$t('common.prefix')">
      </el-table-column>
      <el-table-column prop="max_length" :label="$t('common.maxlength')">
      </el-table-column>
      <el-table-column prop="asn" :label="$t('common.asn')"> </el-table-column>
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
  // margin-left: 42px;
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
