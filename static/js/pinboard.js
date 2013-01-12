var socket = new WebSocket("ws://localhost:7100/ws/" + boardId);
var items = [];

socket.onmessage = handleMessage;
function handleMessage(message) {
  var data = $.parseJSON(message.data);
  if ("board" in data) {
    items = data["board"]["items"];
    loadImages(items, initStage);
  } else if ("update_type" in data) {
    item = data["item"];
    
  }
}

function update(group, activeAnchor) {
  var topLeft = group.get(".topLeft")[0];
  var topRight = group.get(".topRight")[0];
  var bottomRight = group.get(".bottomRight")[0];
  var bottomLeft = group.get(".bottomLeft")[0];
  var image = group.get(".image")[0];

  // update anchor positions
  switch (activeAnchor.getName()) {
    case "topLeft":
      topRight.attrs.y = activeAnchor.attrs.y;
      bottomLeft.attrs.x = activeAnchor.attrs.x;
      break;
    case "topRight":
      var yOffset = topRight.attrs.y - topLeft.attrs.y;
      var xOffset = topRight.attrs.x - topLeft.attrs.x;
      var angle = Math.atan(yOffset / xOffset);
      image.setRotation(angle);
      
      var curHeight = bottomLeft.attrs.y - topLeft.attrs.y;
      
      bottomRight.attrs.x = topRight.attrs.x - yOffset;
      bottomRight.attrs.y = topRight.attrs.y + curHeight;
      
      break;
    case "bottomRight":
      bottomLeft.attrs.y = activeAnchor.attrs.y;
      topRight.attrs.x = activeAnchor.attrs.x;
      break;
    case "bottomLeft":
      bottomRight.attrs.y = activeAnchor.attrs.y;
      topLeft.attrs.x = activeAnchor.attrs.x;
      break;
  }

  image.setPosition(topLeft.attrs.x, topLeft.attrs.y);
  
  var width = topRight.attrs.x - topLeft.attrs.x;
  var height = bottomLeft.attrs.y - topLeft.attrs.y;
  
  if(width && height && activeAnchor.getName() == "bottomRight") {
    image.setSize(width, height);
  }
}

function addAnchor(group, x, y, name) {
  var stage = group.getStage();
  var layer = group.getLayer();

  var anchor = new Kinetic.Circle({
    x: x,
    y: y,
    stroke: "#666",
    fill: "#ddd",
    strokeWidth: 2,
    radius: 4,
    name: name,
    draggable: true
  });

  anchor.on("dragmove", function() {
    update(group, this);
    layer.draw();
  });
  anchor.on("mousedown touchstart", function() {
    group.setDraggable(false);
    this.moveToTop();
  });
  anchor.on("dragend", function() {
    group.setDraggable(true);
    layer.draw();
  });
  // add hover styling
  anchor.on("mouseover", function() {
    var layer = this.getLayer();
    document.body.style.cursor = "pointer";
    this.setStrokeWidth(4);
    layer.draw();
  });
  anchor.on("mouseout", function() {
    var layer = this.getLayer();
    document.body.style.cursor = "default";
    this.setStrokeWidth(2);
    layer.draw();
  });

  group.add(anchor);
}

function loadImages(sources, callback) {
  var images = [];
  var loadedImages = 0;
  var numImages = 0;
  for(var src in sources) {
    numImages++;
  }
  for(var i = 0; i < sources.length; i++) {
    var img = new Image();
    images.push(img);
    img.onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    img.src = sources[i]["image_url"];
    img.item = sources[i];
  }
}

function initStage(images) {
  var stage = new Kinetic.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight
  });
  var layer = new Kinetic.Layer();
  stage.add(layer);

  for (var i = 0; i < images.length; i++) {
    var imageGroup = new Kinetic.Group({
      x: images[i].item.pos_x,
      y: images[i].item.pos_y,
      draggable: true
    });
    
    (function(image) {
      imageGroup.on("dragend", function() {
        var position = imageGroup.getPosition();
        image.item.pos_x = position.x;
        image.item.pos_y = position.y;
        
        var data = {
          "board_id": boardId,
          "item": image.item
        };
        
        socket.send(JSON.stringify(data));
      });
    })(images[i]);
    
    /*
     * go ahead and add the groups
     * to the layer and the layer to the
     * stage so that the groups have knowledge
     * of its layer and stage
     */
    layer.add(imageGroup);

    var img = new Kinetic.Image({
      x: 0,
      y: 0,
      image: images[i],
      width: 200,
      height: 138,
      name: "image",
    });
    imageGroup.add(img);
    var size = img.getSize();
    addAnchor(imageGroup, 0, 0, "topLeft");
    addAnchor(imageGroup, size.width, 0, "topRight");
    addAnchor(imageGroup, size.width, size.height, "bottomRight");
    addAnchor(imageGroup, 0, size.height, "bottomLeft");

    imageGroup.on("dragstart", function() {
      this.moveToTop();
    });
    stage.draw();
  }
}