curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=1afa3275-1ee7-4f5b-8417-4ac2b8f0f294&url=http://www.google.com&image_url=http://www.fellowearthlings.org/images/home_meerkat.jpg&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    http://localhost:7100/add_item/
