function Counter(interval, interval_action, idle, idle_action, callbacks) {

  this.interval = interval;
  this.interval_action = interval_action;

  this.idle = idle;
  this.idle_action = idle_action;

  this.callbacks = (callbacks === undefined ? {} : callbacks);

  this.interval_timer = null;
  this.idle_timer = null;
  this.counter = idle;
}

Counter.prototype =  {
  play: function() {
    this.interval_timer =
      window.setInterval(this.interval_action, this.interval);
    this.timeout();

    if(this.callbacks['play'] !== undefined) this.callbacks['play'];
  },
  stop: function() {
    window.clearInterval(this.interval_timer);
    window.clearTimeout(this.idle_timer);
    this.counter = this.idle;

    if(this.callbacks['stop'] !== undefined) this.callbacks['stop'];
  },
  pause: function() {
    window.clearInterval(this.interval_timer);
    window.clearTimeout(this.idle_timer);

    if(this.callbacks['pause'] !== undefined) this.callbacks['pause'];
  },
  replay: function() {
    this.stop();
    this.start();

    if(this.callbacks['replay'] !== undefined) this.callbacks['replay'];
  },
  timeout: function() {
    if(this.counter <= 0) {
      this.pause();
      this.idle_action();
    } else {
      var that = this;
      this.idle_timer = window.setTimeout(function() {
        that.counter -= 1000;
        that.timeout();
      }, 1000);
    }
  },
  in_timeout: function() {
    return this.counter <= 0;
  },
  refresh: function() {
    this.counter = this.idle;
  }
}
