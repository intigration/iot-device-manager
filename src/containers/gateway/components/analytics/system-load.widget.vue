<template>
  <highcharts :options="chartOptions" :callback="onChartLoad"></highcharts>
</template>

<script>
import { mapGetters } from 'vuex'
import { GW_SYSTEM_LOAD } from '@/store/actions/gateway-analytics'
import { fetchSystemLoad } from '../../../../services/gateway-analytics.service'

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
        text: 'System Load'
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
          name: '15 Minutes',
          data: []
        },
        {
          // showInLegend: false,
          name: '1 Minute',
          data: []
        },
        {
          // showInLegend: false,
          name: '5 Minutes',
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
      const resp = await fetchSystemLoad(gatewayId)
      // console.log(resp)
      const { data } = resp

      const dataForProcessing = [...data.data]
      const pointCount = dataForProcessing.length
      dataForProcessing.splice(0, Math.floor(pointCount / 5))

      const formatted = this.formatter(dataForProcessing)
      const last = formatted.fifteenMinute.length - 1

      // console.log('SYSTEM LOAD', formatted.fifteenMinute[last], formatted.oneMinute[last], formatted.fiveMinute[last])
      this.$store.commit(GW_SYSTEM_LOAD, formatted.oneMinute[last] || 0)

      this.chartOptions.series[0].data = [...formatted.fifteenMinute]
      this.chartOptions.series[1].data = [...formatted.oneMinute]
      this.chartOptions.series[2].data = [...formatted.fiveMinute]
      this.chartOptions.xAxis.categories = formatted.xAxis
    },

    formatter (dataArr) {
      const xAxis = dataArr.map(row => {
        const d = new Date(row[0])
        return d.getHours() + ':' + d.getMinutes()
      }).reverse()
      const fifteenMinute = dataArr.map(row => Number(row[1])).reverse()
      const oneMinute = dataArr.map(row => Number(row[2])).reverse()
      const fiveMinute = dataArr.map(row => Number(row[3])).reverse()

      return { xAxis, fifteenMinute, oneMinute, fiveMinute }
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