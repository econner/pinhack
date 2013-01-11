var Pinboard = (function() {
  var pins = [],
      mainCanvas = null,
      mainContext = null,
      viewportWidth = 0,
      viewportHeight = 0,
      // Currently selected pin.
      mySelected = null,
      offsetx = 0;
      offsety = 0;
  
  /**
   * Create DOM elements and get your game on
   */
  function initialize() {
    // start by measuring the viewport
    onWindowResize();

    // create a canvas for the fireworks
    mainCanvas = document.createElement('canvas');
    mainContext = mainCanvas.getContext('2d');

    // set the dimensions on the canvas
    setMainCanvasDimensions();

    // add the canvas in
    document.body.appendChild(mainCanvas);
    
    // Listeners.
    document.addEventListener('mousedown', mouseDown, true);
    document.addEventListener('mouseup', mouseUp, true);
    document.addEventListener('mousemove', mouseMove, true);
    
    // add some test pins.
    pins.push(makePin());
    
    // and now we set off
    update();
  }
  
  function mouseDown(coords) {
    $.each(pins, function(i, pin) {
      var point = {"x": coords.x, "y": coords.y};
      if (pin.pointOverlaps(point)) {
        mySelected = pin;
        offsetx = point.x - mySelected.pos.x;
        offsety = point.y - mySelected.pos.y;
      }
    });
  }
  
  function mouseUp() {
    mySelected = null;
  }
  
  function mouseMove(coords) {
    if (mySelected) {
      mySelected.pos.x = coords.x - offsetx;
      mySelected.pos.y = coords.y - offsety;
    }
  }
  
  function makePin() {
    var position = {
      "x": viewportWidth * Math.random(),
      "y": viewportHeight * Math.random()
    };
    return new Pin(position);
  }
  
  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  /**
   * Callback for window resizing -
   * sets the viewport dimensions
   */
  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }
  
  /**
   * The main loop where everything happens
   */
  function update() {
    clearContext();
    requestAnimFrame(update);
    drawScene();
  }
  
  /**
   * Update and draw the scene.
   */
  function drawScene() {
    $.each(pins, function(i, pin) {
      pin.update(viewportHeight);
      pin.render(mainContext);
    });
  }
  
  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.clearRect(0, 0, viewportWidth, viewportHeight);
  }
  
  // declare an API
  return {
    initialize: initialize,
  };
})();


/**
  * Pin Object.
  */
var Pin = function(position) {
  this.pos = {
    x: position.x || 0,
    y: position.y || 0
  };
  this.lastPos = {
    x: position.x || 0,
    y: position.y || 0
  };
  this.width = 100;
  this.height = 300;
};

Pin.prototype = {
  pointOverlaps: function(point) {
    return point.x > this.pos.x && point.x < (this.pos.x + this.width)
      && point.y > this.pos.y && point.y < (this.pos.y + this.height);
  },
  
  update: function(height) {
    // update the pins position.
  },

  render: function(context) {
    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        width = this.width,
        height = this.height;

    context.save();

    // draw the line from where we were to where
    // we are now
    context.beginPath();
    context.fillStyle = 'green';
    context.fillRect(x, y, width, height);

    context.restore();
  }
};

// Go
window.onload = function() {
  Pinboard.initialize();
};