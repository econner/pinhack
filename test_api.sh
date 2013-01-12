curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=0224107f-e2b8-4d85-8f9d-0eb6a515b380&url=http://www.google.com&image_url=http://www.fellowearthlings.org/images/home_meerkat.jpg&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    http://localhost:7100/add_item/
