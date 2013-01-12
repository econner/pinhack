var pins = {},
  stage = null,
  layer = null;

var PADDING = 10;

/** ima hide shit in pinboard **/
var pinboard = {};

$(document).ready(function() {
  socket.onmessage = handleMessage;
});

function handleMessage(message) {
  var data = $.parseJSON(message.data);
  if ("users_connected" in data) {
    UserDisplay.render(data['users_connected']);
  }

  if ("board" in data) {
    var items = data["board"]["items"];
    addItems(items);
  } else if ("update_type" in data) {
    if (data["update_type"] == "add_item") {
      addItem(data["item"]);
    } else {
      var updatedItem = data["item"];
      var itemGroup = pins[updatedItem.id].group;
      var originalItem = pins[updatedItem.id].item;

      // Update position and scale.
      itemGroup.setPosition(updatedItem.pos_x, updatedItem.pos_y);
      var scale = updatedItem.scale;

      var newWidth = originalItem.original_width * scale;
      var newHeight = originalItem.original_height * scale;
      resizeItemGroup(itemGroup, newWidth, newHeight, true);

      stage.draw();
    }
  }
}

function resizeItemGroup(itemGroup, newWidth, newHeight, shouldUpdateDragger) {
  var fullWidth = newWidth + PADDING * 2;
  var fullHeight = newHeight + PADDING * 2;
  itemGroup.get(".image")[0].setSize(newWidth, newHeight);
  itemGroup.get(".rect")[0].setSize(fullWidth, fullHeight);
  itemGroup.get(".resizeWidget")[0].setPosition(fullWidth, fullHeight);
  itemGroup.get(".image")[0].setPosition(PADDING, PADDING);

  if (shouldUpdateDragger) {
    itemGroup.get(".bottomRight")[0].setPosition(fullWidth, fullHeight);
  }
}

function update(group, activeAnchor, item) {
  var topLeft = group.get(".topLeft")[0];
  var topRight = group.get(".topRight")[0];
  var bottomRight = group.get(".bottomRight")[0];
  var bottomLeft = group.get(".bottomLeft")[0];
  var resizeWidget = group.get(".resizeWidget")[0];

  var image = group.get(".image")[0];

  // update anchor positions
  switch (activeAnchor.getName()) {
    case "topLeft":
      topRight.attrs.y = activeAnchor.attrs.y;
      bottomLeft.attrs.x = activeAnchor.attrs.x;
      break;
    case "topRight":
      topLeft.attrs.y = activeAnchor.attrs.y;
      bottomRight.attrs.x = activeAnchor.attrs.x;
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

  var imageSize = image.getSize();
  var aspectRatio = imageSize.width / imageSize.height;

  var width = topRight.attrs.x - topLeft.attrs.x;
  var height = width / aspectRatio;
  if(width && height) {
    item.scale = width / item.original_width;
    resizeItemGroup(group, width, height, false);
  }
}

function addAnchor(group, x, y, name, item) {
  var stage = group.getStage();
  var layer = group.getLayer();

  var anchor = new Kinetic.Circle({
    x: x,
    y: y,
    stroke: "#000",
    fill: "#000",
    opacity: 0,
    strokeWidth: 2,
    radius: 4,
    name: name,
    draggable: true
  });

  anchor.on("dragmove", function() {
    update(group, this, item);
    layer.draw();
  });
  anchor.on("mousedown touchstart", function() {
    group.setDraggable(false);
    this.moveToTop();
  });
  anchor.on("dragend", function() {
    group.setDraggable(true);
    var size = group.get(".image")[0].getSize();
    resizeItemGroup(group, size.width, size.height, true);
    layer.draw();
  });
  // add hover styling
  anchor.on("mouseover", function() {
    var layer = this.getLayer();
    document.body.style.cursor = "se-resize";
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

function addResizeWidget(group, x, y) {
  var anchor = new Kinetic.Circle({
    x: x,
    y: y,
    stroke: "#000",
    fill: "#000",
    strokeWidth: 2,
    radius: 4,
    name: "resizeWidget",
  });

  group.add(anchor);
}

function addPinImage(group) {
  var img = new Image();
  
  img.onload = function() {
    var kineticImage = new Kinetic.Image({
      x: -10,
      y: -20,
      image: img,
      width: 50,
      height: 50,
      name: "pin_image",
    });
    
    group.add(kineticImage);
    stage.draw();
  };
  img.src = "/static/images/pin_green.png";
}


function sendItemUpdate(group, item) {
  var position = group.getPosition();
  item.pos_x = position.x;
  item.pos_y = position.y;

  var width = group.get(".image")[0].getSize().width;
  item.scale = width / item.original_width;

  var data = {
    "board_id": boardId,
    "item": item
  };

  socket.send(JSON.stringify(data));
}

function addGroupForItem(item, image) {
  // Update the item's data.
  item.original_width = image.width;
  item.original_height = image.height;

  var itemGroup = new Kinetic.Group({
    x: item.pos_x,
    y: item.pos_y,
    draggable: true
  });

  // Map the item id to the data.
  pins[item.id] = {
    "item": item,
    "group": itemGroup
  };

  (function(image, item) {
    itemGroup.on("dragend", function(evt) {
      sendItemUpdate(this, item);
      pinboard.current_image = this.getChildren()[0];
      pinboard.current_item = item;
    });

    itemGroup.on("dragmove", function() {
      var currentTime = new Date()
      if (currentTime.getTime() % 5 == 0) {
        sendItemUpdate(this, item);
      }
    });
  })(image, item);

  layer.add(itemGroup);

  var imageWidth = image.width * item.scale;
  var imageHeight = image.height * item.scale;

  // Rect padding for the item.
  var rect = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: imageWidth + PADDING * 2,
    height: imageHeight + PADDING * 2,
    fill: 'black',
    stroke: 'black',
    cornerRadius: 5,
    opacity: 0.5,
    strokeWidth: 1,
    name: "rect"
  });
  itemGroup.add(rect);

  // Main image content for the item.
  var img = new Kinetic.Image({
    x: PADDING,
    y: PADDING,
    image: image,
    width: image.width * item.scale,
    height: image.height * item.scale,
    name: "image",
  });
  itemGroup.add(img);

  var size = rect.getSize();
  addResizeWidget(itemGroup, size.width, size.height);
  addAnchor(itemGroup, 0, 0, "topLeft", item);
  addAnchor(itemGroup, size.width, 0, "topRight", item);
  addAnchor(itemGroup, size.width, size.height, "bottomRight", item);
  addAnchor(itemGroup, 0, size.height, "bottomLeft", item);
  addPinImage(itemGroup);

  itemGroup.on("dragstart", function() {
    this.moveToTop();
  });
  itemGroup.moveToTop();
  stage.draw();
}

function addItems(items) {
  for (var i = 0; i < items.length; i++) {
    addItem(items[i]);
  }
}

function addItem(item) {
  var img = new Image();

  (function(item, img) {
    img.onload = function() {
      addGroupForItem(item, img);
    };
  })(item, img);
  img.src = item["image_url"];
}

function setupLastObjectTracking(stage) {
  stage.on('click', function(evt) {
    var shape = evt.shape;
    if (shape.getName() === 'image') {
      // Store this image if we need to delete.
      pinboard.current_image = shape;
    }
  });

  stage.on('dblclick', function(evt) {
    var shape = evt.shape;
    if (shape.getName() === 'image') {
      var url = shape.getImage().item.url
      window.open(url, '_blank');
      window.focus();
    }
  });
}

$(document).keyup(function (e) {
  if (e.keyCode == 46) {
      if (pinboard.current_image) {
          var image = pinboard.current_image;
          var group = image.getParent();
          var item = pinboard.current_item;
          group.removeChildren()
          pinboard.current_image = undefined;
          stage.draw();
          $.ajax({
            url: "/remove_item/",
            type: 'PUT',
            data: {board_id: boardId, id:item.id}}).done(function() { console.log("Really deleted."); });
      } else {
          console.log('Nothing to delete');
      }
  }
});

function initStage() {
  stage = new Kinetic.Stage({
    container: "container",
    width: window.innerWidth,
    height: window.innerHeight
  });
  layer = new Kinetic.Layer();
  stage.add(layer);

  var imageObj = new Image();
  imageObj.onload = function() {
    var cork = new Kinetic.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: window.innerWidth,
      height: window.innerHeight
    });
    layer.add(cork);
    stage.draw();
  };

  imageObj.src = '/static/images/cork.jpg';
  setupLastObjectTracking(stage);

}


window.onload = initStage;
