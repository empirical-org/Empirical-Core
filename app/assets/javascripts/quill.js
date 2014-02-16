window.Quill = function Quill (host) {
  this.host = host;
  if (!host) this.host = 'http://api.quill.org/';

  if ($('iframe#activity-iframe').length > 0) {
    this.target = $('iframe#activity-iframe')[0].contentWindow;
    this.$iframe = $('iframe#activity-iframe');
    var context = this.iframe;
    delete this.iframe;
  } else {
    this.target = window.parent;
    var context = this.wrapper;
    delete this.wrapper;
  }

  function Target () { }
  jQuery.extend(Target.prototype, this, context);
  this.events = new Target;
};

jQuery.extend(Quill.prototype, {
  iframe: {
    resize: function (dimensions) {
      this.$iframe.height(dimensions.height);
    },

    activityFinished: function (options) {
      window.location = '/activity_sessions/' + options.id;
    }
  },

  wrapper: {
    cheat: function () {
      Cheater();
    }
  },

  sendMessage: function (type, payload) {
    var data = {
      messageType: type,
      payload: payload
    };

    var json = JSON.stringify(data);
    this.target.postMessage(json, this.host);
  },

  finishActivityWithResults: function (id, params) {
    $.ajax('http://localhost:3001/', {
      type: 'PUT',
      success: function (data) {
        this.finishActivity();
      }
    });
  },

  finishActivity: function (id) {
    this.sendMessage('activityFinished', {id: id});
  },

  autoResize: function () {
    if (window.self == window.top) return;

    // http://stackoverflow.com/a/14901150/1397097
    function checkDocumentHeight (callback) {
      var lastHeight = $(document).height()
        , newHeight;

      setInterval(function () {
        newHeight = document.body.offsetHeight;
        if (lastHeight != newHeight) callback();
        lastHeight = newHeight;
      }, 400);
    }

    function postWindowSize (first) {
      var data = {};

      if (first == 'first') {
        data.height = $(document).height();
      } else {
        data.height = document.body.offsetHeight;
      }

      this.sendMessage('resize', data);
    }

    checkDocumentHeight(postWindowSize.bind(this));
    postWindowSize.bind(this)('first');
  },

  cheat: function () {
    this.sendMessage('cheat');
  },

  listen: function () {
    $(window).on('message', function (e) {
      var data = JSON.parse(e.originalEvent.data);
      this.events[data.messageType](data.payload);
    }.bind(this));
  }
});
