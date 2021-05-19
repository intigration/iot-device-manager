<template>
  <highcharts :options="chartOptions" :callback="onChartLoad"></highcharts>
</template>

<script>
import { mapGetters } from 'vuex'
import { GW_SYSTEM_DISK, GW_CONTAINER_DISK } from '@/store/actions/gateway-analytics'
import Highcharts from 'highcharts'
import { fetchDiskUsage } from '../../../../services/gateway-analytics.service'

export default {
  data: () => ({
    intervalId: null,
    chartOptions: {
      chart: {
        type: 'pie',
        spacingBottom: 30,
        height: 200
      },
      title: {
        text: null
      },
      subtitle: {
        text: 'DISK'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: 'Disk',
        data: []
      }],
      yAxis: {
        title: null
      },
      xAxis: {
        title: null
      }
    }
  }),

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  computed: mapGetters([
    'gatewayBackendRetrievedInfo'
  ]),

  methods: {
    async loadData (gatewayId) {
      const resp = await fetchDiskUsage(gatewayId)
      // console.log(resp)
      const { data } = resp

      const dataForProcessing = [...data.data]
      const pointCount = dataForProcessing.length
      dataForProcessing.splice(0, Math.floor(pointCount / 5))

      const formatted = this.formatter(dataForProcessing)
      const last = formatted.systemDiskUsage.length ? formatted.systemDiskUsage.length - 2 : 0

      this.$store.dispatch(GW_SYSTEM_DISK, formatted.systemDiskUsage[last])
      this.$store.dispatch(GW_CONTAINER_DISK, formatted.containerDiskUsage[last])

      this.chartOptions.series[0].data = [
        { name: 'Free', y: 100 - formatted.systemDiskUsage[0] },
        { name: 'In Use', y: formatted.systemDiskUsage[0], selected: true, sliced: true }
      ]
    },

    formatter (dataArr) {
      const xAxis = dataArr.map(row => {
        const d = new Date(row[0])
        return d.getHours() + ':' + d.getMinutes()
      }).reverse()
      const systemDiskUsage = dataArr.map(row => Number(row[1])).reverse()
      const containerDiskUsage = dataArr.map(row => Number(row[2])).reverse()

      return { xAxis, systemDiskUsage, containerDiskUsage }
    },

    onChartLoad (chartRef) {
      const gatewayId = this.gatewayBackendRetrievedInfo.id
      this.loadData(gatewayId)
      this.intervalId = setInterval(() => {
        this.loadData(gatewayId)
      }, 5000)
    }
  }
}
</script>

<style scoped>

</style>