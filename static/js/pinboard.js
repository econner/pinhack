var socket = new WebSocket("ws://localhost:7100/ws/" + boardId);
var items = [];
var pins = {};
var stage = null;
var layer = null

/** ima hide shit in pinboard **/
var pinboard = {};

socket.onmessage = handleMessage;
function handleMessage(message) {
  var data = $.parseJSON(message.data);
  if ("users_connected" in data) {
    UserDisplay.render(data['users_connected']);
  }

  if ("board" in data) {
    items = data["board"]["items"];
    loadImages(items);
  } else if ("update_type" in data) {
    if (data["update_type"] == "add_item") {
      item = data["item"];
      var img = new Image();
      img.onload = function() {
        addImage(img);
      };
      img.src = item["image_url"];
      img.item = item;
    } else {
      item = data["item"];
      pin = pins[item.id];
      pin.setPosition(item.pos_x, item.pos_y);
      stage.draw();
    }
  }
}

function update(group, activeAnchor) {
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
    image.setSize(width, height);
    resizeWidget.setPosition(width, height);
  }
}

function addAnchor(group, x, y, name) {
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
    update(group, this);
    layer.draw();
  });
  anchor.on("mousedown touchstart", function() {
    group.setDraggable(false);
    this.moveToTop();
  });
  anchor.on("dragend", function() {
    group.setDraggable(true);
    var size = group.get(".image")[0].getSize();
    anchor.setPosition(size.width, size.height);
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


function loadImages(items, callback) {
  for (var i = 0; i < items.length; i++) {
    item = items[i];
    var img = new Image();
    img.onload = function() {
      addImage(this);
    };
    img.src = item["image_url"];
    img.item = item;
  }
}

function addImage(image) {
  var imageGroup = new Kinetic.Group({
    x: image.item.pos_x,
    y: image.item.pos_y,
    draggable: true
  });

  pins[image.item.id] = imageGroup;

  (function(image) {
    imageGroup.on("dragend", function(evt) {
      var position = this.getPosition();
      image.item.pos_x = position.x;
      image.item.pos_y = position.y;
      pinboard.current_image = this.getChildren()[0];
      var data = {
        "board_id": boardId,
        "item": image.item
      };

      socket.send(JSON.stringify(data));
    });

    imageGroup.on("dragmove", function() {
      var currentTime = new Date()
      if (currentTime.getTime() % 5 == 0) {
        var position = this.getPosition();
        image.item.pos_x = position.x;
        image.item.pos_y = position.y;

        var data = {
          "board_id": boardId,
          "item": image.item
        };

        socket.send(JSON.stringify(data));
      }
    });

  })(image);

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
    image: image,
    width: image.width,
    height: image.height,
    name: "image",
  });
  imageGroup.add(img);
  var size = img.getSize();
  addResizeWidget(imageGroup, size.width, size.height);
  addAnchor(imageGroup, 0, 0, "topLeft");
  addAnchor(imageGroup, size.width, 0, "topRight");
  addAnchor(imageGroup, size.width, size.height, "bottomRight");
  addAnchor(imageGroup, 0, size.height, "bottomLeft");

  imageGroup.on("dragstart", function() {
    this.moveToTop();
  });
  stage.draw();
}

function setupLastObjectTracking(stage) {
  stage.on('click', function(evt) {
    var shape = evt.shape;
    console.log('Clicked on ' + shape.getName());
    if (shape.getName() === 'image') {
      // Store this image if we need to delete.
      pinboard.current_image = shape;
    }
  });
}

$(document).keyup(function (e) {
  if (e.keyCode == 46) {
      if (pinboard.current_image) {
          console.log(pinboard.current_image);
          var image = pinboard.current_image;
          var group = image.getParent();
          var item = image.attrs.image.item;
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
  imageObj.src = 'http://www.a-gc.com/images/2012/11/textures-corkboard-HD-Wallpapers.jpg';
  setupLastObjectTracking(stage);

}


window.onload = initStage;
