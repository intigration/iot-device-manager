<template>
  <div style="margin: 0 120px;" class="pt-6">
    <el-row :gutter="20">
      <el-col :span="12">
        <access-point-config-info-widget class="bg-gray-100"></access-point-config-info-widget>
      </el-col>
      <el-col :span="12">
        <div class="text-gray-600 font-medium">Setup Access Point</div>
        <div class="mt-6">
          <access-point-setup-form />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AccessPointConfigInfoWidget from '../widgets/access-point-config-info.widget'
import AccessPointSetupForm from '../forms-components/access-point'

export default {
  components: {
    AccessPointConfigInfoWidget,
    AccessPointSetupForm
  }
}
</script>
