(function(undefined) {
  'use strict';

  var asyncElement = function() {
    var id =  Math.random().toString(36).substring(7);
    return {
      find: () => document.getElementById(id),
      element: '<span id="' + id + '"></span>'
    };
  }

  Handlebars.registerHelper('formatDate', function(ts, format) {
    return new Handlebars.SafeString(moment(ts).format(format));
  });

  Handlebars.registerHelper('formatNow', function(format) {
    return new Handlebars.SafeString(moment().format(format));
  });

  Handlebars.registerHelper('video', function(src) {
    return new Handlebars.SafeString('<video class="embed" controls><source src="' + src + '">Your browser does not support the video tag.</video>');
  });

  Handlebars.registerHelper('youtube', function(id) {
    return new Handlebars.SafeString('<iframe class="youtube embed" src="https://www.youtube.com/embed/' + 
      id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
  });

  Handlebars.registerHelper('youtube-playlist', function(id) {
    return new Handlebars.SafeString('<iframe class="youtube embed" src="https://www.youtube.com/embed/videoseries?list=' + 
      id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
  });

  Handlebars.registerHelper('viz', function(opts) {
    var ele = asyncElement();

    new Viz().renderSVGElement(opts.fn()).then(
      graph => ele.find().appendChild(graph), 
      ex => ele.find().innerHTML = '<div class="error">Error in {{ viz }} helper: ' + ex + "</div>" // needs help to show as error
    );

    return new Handlebars.SafeString(ele.element);
  });
})();