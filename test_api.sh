curl -i \
    -H "Accept: application/json" \
    -X PUT -d "board_id=211e39d9-92da-4944-a6ad-bd6c5e7f6cd8&url=http://www.google.com&image_url=http://www.amazon.com&tags=[abc,def]&pos_x=40.5&pos_y=30.2&scale=1.3&locked=true"\
    http://localhost:7100/add_item/
