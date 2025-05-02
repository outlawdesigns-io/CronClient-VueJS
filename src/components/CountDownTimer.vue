<template>
  <span v-if="timer">
    {{ timeCalculated }}
  </span>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  name: 'CountDownTimer',

  props: {
    endDate: {
      type: String,
      required: true
    },
    countUp:{
      type:Boolean
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
      const endDateDateTimeObj = DateTime.fromMillis(this._parseDate(this.endDate))
      const theDiff = endDateDateTimeObj.diff(this.now, ['days','hours', 'minutes', 'seconds'])
      let days = this.countUp ? this._toLocale(Math.abs(theDiff.days)):this._toLocale(theDiff.days)
      let hours = this.countUp ? this._toLocale(Math.abs(theDiff.hours)):this._toLocale(theDiff.hours)
      let minutes = this.countUp ? this._toLocale(Math.abs(theDiff.minutes)):this._toLocale(theDiff.minutes)
      let seconds = this.countUp ? this._toLocale(Math.abs(Math.round(theDiff.seconds))):this._toLocale(Math.round(theDiff.seconds))
      return `${days}:${hours}:${minutes}:${seconds}`
    }
  },
  methods:{
    _parseDate(dateStr){
      return Date.parse(dateStr)
    },
    _toLocale(number){
      return number.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
    },
    _countDownInterval(endDateTimeObj){
      return ()=>{
        this.now = DateTime.local();
      }
    }
  },

  watch: {
    endDate: {
      immediate: true,

      handler (endDateTimeStr) {
        const endDateTimeObj = DateTime.fromMillis(this._parseDate(endDateTimeStr))

        if (this.timer) {
          clearInterval(this.timer)
        }

        this.timer = setInterval(this._countDownInterval(endDateTimeObj), 1000);
      }
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
