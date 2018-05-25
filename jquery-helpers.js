(function($, undefined) {
  'use strict';

  $.extend({
    // Usage: $.parms.name
    parms: {}, // filled in later    

    // Usage: $.timeout(5000, "my string").done(...)
    // Usage: $.timeout(2000).done(...)
    // Usage: $.timeout(200).cancel() 
    timeout: function(ms, val) {
      var def = $.Deferred(), id = setTimeout(function() {
        def.resolve(val);
      }, ms);

      return $.extend(def.promise(), {
        cancel: function() {
          clearTimeout(id);
        }
      });
    },

    // Usage: $.webStorage('my-item', function() { return $.ajax(...) })
    webStorage: function(itemKey, fillItemFx, options) {
      var opts = $.extend({
        storage: sessionStorage
      }, options), json = opts.storage.getItem(itemKey);

      return json ? $.when(JSON.parse(json)) : $.when(fillItemFx()).done(function(v) {
        opts.storage.setItem(itemKey, JSON.stringify(v));
      });
    }
  });
  
  // fill in $.parms
  $.each($(window.location.search.substring(1).split('&')), function(i, pair) {
    if (pair) {
      pair = pair.split('=');
      $.parms[pair[0]] = pair[1] ? window.decodeURIComponent(pair[1].replace(/\+/g, '%20')) : true;
    }
  });

  // Usage: $('#template').handlebars({ name: 'fred', age: 41 })
  $.fn.handlebars = function(ctx, options) {
    var opts = $.extend({
      effect: function(newContent) {
        newContent.slideDown();
      }
    }, options);

    return this.each(function() {
      var content = $(Handlebars.compile(this.innerHTML)(ctx)).hide();
      $(this).replaceWith(content);
      content.trigger('contentAdded'); // but not displayed
      opts.effect(content);
    });
  };  
}) (jQuery);
