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
      const theDiff = endDateDateTimeObj.diff(this.now, ['hours', 'minutes', 'seconds'])

      return `${theDiff.hours}:${theDiff.minutes}:${Math.round(theDiff.seconds)}`
    }
  },
  methods:{
    _parseDate(dateStr){
      return Date.parse(dateStr)
      //return [dateStr.slice(0, 3), ", ", dateStr.slice(4)].join('').replace(/-.*/,"");
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

        this.timer = setInterval(() => {
          this.now = DateTime.local()

          if (this.now > endDateTimeObj) {
            this.now = endDateTimeObj
            clearInterval(this.timer)
          }
        }, 1000)
      }
    }
  },

  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
