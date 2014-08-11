// constructor. Takes the host of the target as an argument.
window.Quill = function Quill (host, options) {
  if (typeof options == 'undefined') options = {};
  this.options = options;

  // assign host.
  this.host = host;
  if (!host) this.host = 'http://api.quill.org/';

  // if the iframe is present, we assume we are on quill.org
  if ($('iframe#activity-iframe').length > 0) {
    // locate window
    this.target = $('iframe#activity-iframe')[0].contentWindow;
    this.$iframe = $('iframe#activity-iframe');

    // use iframe object as event context.
    var context = this.iframe;
    delete this.iframe;
  } else {
    // locate window
    this.target = window.parent;

    // use quill.org object as event context.
    var context = this.wrapper;
    delete this.wrapper;
  }

  // create events instance that contains the Quill context as well as
  // the context of the relevant events.
  function Target () { }
  jQuery.extend(Target.prototype, this, context);
  this.events = new Target;
};

jQuery.extend(Quill.prototype, {

  //
  // iframe events
  //
  // This object contain all of the events coming from the iframe. these are callbacks
  // triggered by the iframe and executed on quill.org (or whatever is parent to the iframe)
  //
  iframe: {
    // this is the handler for the resize event coming from the iframe.
    // it contains the new dimensions of the content contained from within the iframe.
    resize: function (dimensions) {
      this.$iframe.height(dimensions.height);
    },

    // this is the handler for the finish event for an activity. The iframe sends this
    // event when the user is done with the activity.
    activityFinished: function (options) {
      window.location = '/activity_sessions/' + options.id;
    },

    saveSuccessful: function () {
      this.options.afterIframeActivitySaved();
    },

    iframeReady: function () {
      // Is the browser disabling cookies in the iframe?
      // We have to wait until the iframe is ready to do this otherwise
      // it will break. Also, there doesn't seem to be a way to check the iframe ready state
      // when they are on different domains.
      this.cookieCheck();
    },

    cookiesNotSupported: function () {
      var url = $('<a>', { href:this.host } )[0];
      url.pathname = 'session_fix_redirect';
      url.search = '?return=' + window.location;

      window.location = url.href;
      // setTimeout(function () {
      // debugger;
      // window.location = url.href;
      // }, 1000);
    }
  },

  //
  // wrapper events
  //
  // these are callbacks for events issued by quill.org. They can be set up with standard
  // behavior or be overridden by the module for custom behavior
  //
  wrapper: {
    // this handler is for the cheat event coming from Quill. the recipient can choose
    // how to handle this. Right now, it is hardcoded to the questions-module Cheater.
    cheat: function () {
      Cheater();
    },

    checkCookieSupport: function () {
      document.cookie = 'supports cookies';

      if (!document.cookie.match(/supports cookies/))
        this.sendMessage('cookiesNotSupported');
    },

    savingActivity: function () {
      $('.js-acivity-form form').submit();
    }
  },

  // this sends messages between iframe and Quill.
  // this.target is the apposing window. On quill.org, it is the iframe,
  // from within the iframe, it is quill.org.
  sendMessage: function (type, payload) {
    var data = {
      messageType: type,
      payload: payload
    };

    var json = JSON.stringify(data);
    this.target.postMessage(json, this.host);
  },

  // TODO: this is a sketch, it's not used by anything.
  // finishActivityWithResults: function (id, params) {
  //   $.ajax('http://localhost:3001/', {
  //     type: 'PUT',
  //     success: function (data) {
  //       this.finishActivity();
  //     }
  //   });
  // },

  // this sends the activityFinished event with the id of the session.
  finishActivity: function (id) {
    this.sendMessage('activityFinished', {id: id});
  },

  // turn on resize detection. Begins polling quill.org with content dimensions
  // of module.
  autoResize: function () {
    // no wrapper, we are not in an iframe. Early exit.
    if (window.self == window.top) return;

    // modified from: http://stackoverflow.com/a/14901150/1397097
    function checkDocumentHeight (callback) {
      var lastHeight = $(document).height()
        , newHeight;

      // there doesn't seem to be a reliable way to detected wh
      setInterval(function () {
        newHeight = document.body.offsetHeight;
        if (lastHeight != newHeight) callback();
        lastHeight = newHeight;
      }, 400);
    }

    // send the dimensions to quill.org.
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

  // send cheat message to iframe
  cheat: function () {
    this.sendMessage('cheat');
  },

  cookieCheck: function () {
    this.sendMessage('checkCookieSupport');
  },

  // begin listening to postMessage events
  listen: function () {
    $(window).on('message', function (e) {
      var data = JSON.parse(e.originalEvent.data);
      this.events[data.messageType](data.payload);
    }.bind(this));
  }
});
