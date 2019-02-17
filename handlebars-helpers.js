(function(undefined) {
  'use strict';

  var randomString = function() {
    return Math.random().toString(36).substring(7);
  };

  Handlebars.registerHelper('formatDate', function(ts, format) {
    return new Handlebars.SafeString(moment(ts).format(format));
  });

  Handlebars.registerHelper('formatNow', function(format) {
    return new Handlebars.SafeString(moment().format(format));
  });

  Handlebars.registerHelper('youtube', function(id) {
    return new Handlebars.SafeString('<iframe class="youtube embed" src="https://www.youtube.com/embed/' + 
      id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
  });

  Handlebars.registerHelper('viz', function(opts) {
    var id = randomString();

    new Viz().renderSVGElement(opts.fn()).then(
      graph => document.getElementById(id).innerHTML = graph, 
      ex => document.getElementById(id).innerHTML = '<div class="error">Error in {{ viz }} helper: ' + ex + "</div>"
    );

    return new Handlebars.SafeString('<span id="' + id + '"></span>');
  });
})();