<template>
  <el-card shadow="none" id="text-widget">
    <div>
      <small>
        <i :class="icon"></i>
        {{label}}
      </small>
      <div class="text-right text-2xl text-black">
        {{value}} <small>{{unit}}</small>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: [
    'label',
    'value',
    'type',
    'unit',
    'icon'
  ]
}
</script>

<style scoped>
#text-widget > .el-card__body {
  padding: 12px !important;
}
</style>