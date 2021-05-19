<template>
  <highcharts :options="chartOptions" :callback="onChartLoad"></highcharts>
</template>

<script>
import { mapGetters } from 'vuex'
import { GW_CPU_MEMORY } from '@/store/actions/gateway-analytics'
import { fetchCpuMemoryUsage } from '../../../../services/gateway-analytics.service'

export default {
  data: () => ({
    intervalId: null,
    chartOptions: {
      chart: {
        type: 'area',
        spacingBottom: 30,
        height: 260
      },
      title: {
        text: null
      },
      subtitle: {
        text: 'CPU & MEMORY'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillOpacity: 0.2,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [
        {
          // showInLegend: false,
          name: 'CPU %',
          data: []
        },
        {
          // showInLegend: false,
          name: 'Memory %',
          data: []
        }
      ],
      yAxis: {
        title: null
      },
      xAxis: {
        title: {
          enabled: false
        }
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
      const resp = await fetchCpuMemoryUsage(gatewayId)
      const { data } = resp

      const dataForProcessing = [...data.data]
      const pointCount = dataForProcessing.length
      dataForProcessing.splice(0, Math.floor(pointCount / 3))

      const formatted = this.formatter(dataForProcessing)
      const last = formatted.cpuPoints.length ? formatted.cpuPoints.length - 1 : 0

      const lastValueForTextWidget = formatted.cpuPoints[last] + ' | ' + formatted.memoryPoints[last]
      this.$store.dispatch(GW_CPU_MEMORY, lastValueForTextWidget || '0')

      this.chartOptions.series[0].data = [...formatted.cpuPoints]
      this.chartOptions.series[1].data = [...formatted.memoryPoints]
      this.chartOptions.xAxis.categories = formatted.xAxis
    },

    formatter (dataArr) {
      const xAxis = dataArr.map(row => {
        const d = new Date(row[0])
        return d.getHours() + ':' + d.getMinutes()
      }).reverse()
      const cpuPoints = dataArr.map(row => row[1]).reverse()
      const memoryPoints = dataArr.map(row => row[2]).reverse()

      return { xAxis, cpuPoints, memoryPoints }
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