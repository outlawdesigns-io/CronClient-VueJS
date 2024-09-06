<template>
  <span v-if="timer">
    {{ timeCalculated }}
  </span>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'OverdueCounter',

  props: {
    startDate: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      now: DateTime.local(),
      timer: null
    }
  },

  computed: {
    timeCalculated () {
      const startDateDateTimeObj = DateTime.fromMillis(this._parseDate(this.startDate))
      const theDiff = startDateDateTimeObj.diff(this.now, ['days','hours', 'minutes', 'seconds'])

      return `${this._toLocale(theDiff.hours)}:${this._toLocale(theDiff.minutes)}:${this._toLocale(Math.round(theDiff.seconds))}`
    }
  },
  methods:{
    _parseDate(dateStr){
      return Date.parse(dateStr)
    },
    _toLocale(number){
      return number.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
    },
    _countInterval(startDateTimeObj){
      return ()=>{
        this.now = DateTime.local();
      }
    }
  },

  watch: {
    startDate: {
      immediate: true,

      handler (startDateTimeStr) {
        const startDateTimeObj = DateTime.fromMillis(this._parseDate(startDateTimeStr))

        if (this.timer) {
          clearInterval(this.timer)
        }

        this.timer = setInterval(this._countInterval(startDateTimeObj), 1000);
      }
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
