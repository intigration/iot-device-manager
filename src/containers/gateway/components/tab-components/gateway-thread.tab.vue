<template>
  <div style="margin: 0 120px;" class="pt-6">
    <el-row :gutter="20">
      <el-col :span="12">
        <thread-config-info-widget></thread-config-info-widget>
      </el-col>

      <el-col :span="12">
        <div class="text-gray-600 font-medium">Setup Proxy</div>
        <el-form v-loading="">
          <el-form-item>
            <!-- <div>
              <el-switch v-model="isEnabled" @change="toggleSignalingProxy"></el-switch>
            </div> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ThreadConfigInfoWidget from '../widgets/thread-config-info.widget'

export default {
  components: { ThreadConfigInfoWidget }
  // computed: mapGetters([])
}
</script>