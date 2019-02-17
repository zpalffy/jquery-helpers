(function($, undefined) {
  'use strict';

  $.extend({
    // Usage: $.timeout(5000, "my string").done(...)
    // Usage: $.timeout(2000).done(...)
    // Usage: $.timeout(200).cancel() 
    timeout: function(ms, val) {
      var def = $.Deferred(), id = setTimeout(() => def.resolve(val), ms);

      return $.extend(def.promise(), {
        cancel: function() {
          clearTimeout(id);
          return this;
        }
      });
    },

    // Usage: $.getCSS('https://first.css', 'https://second.css').done(...)
    getCSS: function(css) {
      return $.when(...css.map(c => $.get(c).done(contents => $('<style>').append(contents).appendTo('head'))));
    },

    // Usage: $.json('/my.json', {name: 'Eric'}).done(...)
    json: function(url, defaultVal) {
      return $.getJSON(url).then(val => val, () => defaultVal);
    },

    // Usage: $.webStorage('my-item', function() { return $.ajax(...) })
    webStorage: function(itemKey, fillItemFx, options) {
      var opts = $.extend({
        storage: sessionStorage
      }, options), json = opts.storage.getItem(itemKey);

      return json ? $.when(JSON.parse(json)) : $.when(fillItemFx()).done(function(v) {
        opts.storage.setItem(itemKey, JSON.stringify(v));
      });
    },
    
    parseParameters: function(str) {
      var parms = {};
      $.each(str.substring(1).split('&'), function(i, pair) {
        if (pair) {
          pair = pair.split('=');
          parms[pair[0]] = pair[1] ? window.decodeURIComponent(pair[1].replace(/\+/g, '%20')) : true;
        }
      });
      
      return parms;
    },

    // Usage: $.worker('abc.js').work(parms).done(...)
    // Usage: $.worker('abc.js').work(parms).terminate()
    worker: function(filename) {
      if (window.Worker) {
        var worker = new Worker(filename);

        return {
          work: function(args) {
            var deferred = $.Deferred();
            worker.onmessage = function(event) {
              deferred.resolve(event.data); 
            };

            worker.onerror = function(event) {
              deferred.reject('Encountered error during work processing.', event); 
            };

            worker.postMessage(args);
            return $.extend(deferred.promise(), {
              terminate: worker.terminate
            });
          }
        };
      } else {
        throw new Error('Worker object not supported in this browser.');
      }
    }
  });

  // Usage: $.parms.name
  $.parms = $.parseParameters(window.location.search);
  
  // Usage: $('#template').handlebars({ name: 'fred', age: 41 })
  $.fn.handlebars = function(ctx, options) {
    var opts = $.extend({
      effect: function(newContent) {
        return newContent.slideDown();
      }
    }, options);

   return this.each(function() {
      var content = $(Handlebars.compile(this.innerHTML)(ctx)).hide();
      $(this).replaceWith(content);
      content.trigger('contentAdded'); // but not displayed
      $.when(opts.effect(content)).done(function() {
        content.trigger('contentShown');
      });
    });
  };  
}) (jQuery);
