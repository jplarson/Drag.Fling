(function() {
  try {
    document.createEvent("TouchEvent");
  } catch(e) {
    return;
  }

  ['touchstart', 'touchmove', 'touchend'].each(function(type){
      Element.NativeEvents[type] = 2;
  });

  var mapping = {
    'mousedown': 'touchstart',
    'mousemove': 'touchmove',
    'mouseup': 'touchend'
  };

  var condition = function(event) {
    var touch = event.event.changedTouches[0];
    event.page = {
      x: touch.pageX,
      y: touch.pageY
    };
    return true;
  };

  for (var e in mapping) {
    Element.Events[e] = {
      base: mapping[e],
      condition: condition
    };
  }
})();