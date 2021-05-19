<template>
  <highcharts :options="chartOptions" :callback="onChartLoad"></highcharts>
</template>

<script>
import { mapGetters } from 'vuex'
import { GW_NETWORK_IN_OUT } from '@/store/actions/gateway-analytics'
import { fetchNetworkUsage } from '../../../../services/gateway-analytics.service'

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
        text: 'NETWORK'
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
          name: 'In kbps',
          data: []
        },
        {
          // showInLegend: false,
          name: 'Out kbps',
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
      const resp = await fetchNetworkUsage(gatewayId)
      // console.log(resp)
      const { data } = resp

      const dataForProcessing = [...data.data]
      const pointCount = dataForProcessing.length
      dataForProcessing.splice(0, Math.floor(pointCount / 5))

      const formatted = this.formatter(dataForProcessing)
      const last = formatted.inKbps.length - 1

      const downloadSpeed = formatted.inKbps[last] || 0
      const uploadSpeed = formatted.outKbps[last] || 0
      const valueForTextWidget = Math.round(downloadSpeed) + ' | ' + Math.round(uploadSpeed)
      this.$store.commit(GW_NETWORK_IN_OUT, valueForTextWidget)

      this.chartOptions.series[0].data = [...formatted.inKbps]
      this.chartOptions.series[1].data = [...formatted.outKbps]
      this.chartOptions.xAxis.categories = formatted.xAxis
    },

    formatter (dataArr) {
      const xAxis = dataArr.map(row => {
        const d = new Date(row[0])
        return d.getHours() + ':' + d.getMinutes()
      }).reverse()
      const inKbps = dataArr.map(row => Number(row[1])).reverse()
      const outKbps = dataArr.map(row => Number(row[2])).reverse()

      return { xAxis, inKbps, outKbps }
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