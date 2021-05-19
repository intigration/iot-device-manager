<template>
  <highcharts :options="chartOptions" :callback="onChartLoad"></highcharts>
</template>

<script>
import { mapGetters } from 'vuex'
import { GW_BE_CONNECTIVITY } from '@/store/actions/gateway-analytics' 
import Highcharts from 'highcharts'
import { fetchStatusHistory } from '../../../../services/gateway-analytics.service'

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
        text: 'Status History'
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
      series: [{
        // showInLegend: false,
        name: 'BE Connection Status',
        step: 'left',
        data: []
      }],
      yAxis: {
        title: null,
        categories: ['Offline', 'Online']
      },
      xAxis: {
        title: null,
        categories: []
      }
    }
  }),

  computed: mapGetters([
    'gatewayBackendRetrievedInfo'
  ]),

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  async created () {},

  methods: {
    async loadData () {
      const serial = this.gatewayBackendRetrievedInfo.serial
      const resp = await fetchStatusHistory(serial)
      const { data } = resp

      const dataForProcessing = [...data]
      dataForProcessing.splice(0, 1)

      const formatted = this.formatter(dataForProcessing)
      const last = formatted.status.length ? formatted.status.length - 1 : 0

      // console.log('STATUS HISTORY', formatted.status[last])
      this.$store.dispatch(GW_BE_CONNECTIVITY, formatted.status[last] === 1 ? 'Online' : 'Offline')

      this.chartOptions.series[0].data = [...formatted.status]
      this.chartOptions.xAxis.categories = formatted.xAxis
    },

    formatter (dataArr) {
      const xAxis = dataArr.map(row => {
        const d = new Date(row[0])
        return d.getHours() + ':' + d.getMinutes()
      }).reverse()
      const status = dataArr.map(row => Number(row[1]) === 2 ? 0 : Number(row[1])).reverse()

      return { xAxis, status }
    },

    onChartLoad (chartRef) {
      this.loadData()
      this.intervalId = setInterval(() => {
        this.loadData()
      }, 5000)
    }
  }
}
</script>

<style scoped>

</style>