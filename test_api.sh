curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=d4430cb8-4eb7-46c4-a342-b3530b861877&url=http://www.google.com&image_url=http://www.fellowearthlings.org/images/home_meerkat.jpg&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    http://localhost:7100/add_item/
