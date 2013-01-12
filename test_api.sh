curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=1afa3275-1ee7-4f5b-8417-4ac2b8f0f294&url=http://www.google.com&image_url=http://www.fellowearthlings.org/images/home_meerkat.jpg&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    -X PUT -d "board_id=d4430cb8-4eb7-46c4-a342-b3530b861877&url=http://www.google.com&image_url=http://www.fellowearthlings.org/images/home_meerkat.jpg&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
>>>>>>> 9002e856d1bafb62896de58b703ad8d07c900937
    http://localhost:7100/add_item/
