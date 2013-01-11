var Pinboard = (function() {
  var pins = [],
      mainCanvas = null,
      mainContext = null,
      viewportWidth = 0,
      viewportHeight = 0;
  
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
    
    // add some test pins.
    pins.push(makePin());
    
    // and now we set off
    update();
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
};

Pin.prototype = {
  update: function(height) {
    // update the pins position.
  },

  render: function(context) {
    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y);

    context.save();

    // draw the line from where we were to where
    // we are now
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();

    context.restore();
  }
};

// Go
window.onload = function() {
  Pinboard.initialize();
};