curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=b5367b2a-b39a-4b43-a115-e9aeeb599465&url=http://www.google.com&image_url=http://www.amazon.com&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    http://localhost:7100/add_item/

