import datetime
from dictshield.document import Document, EmbeddedDocument
from dictshield.fields import UUIDField, StringField, FloatField
from dictshield.fields.compound import ListField, EmbeddedDocumentField

class Item(EmbeddedDocument):
  id    = UUIDField   (auto_fill  = True)
  url   = StringField (max_length = 300)
  pos_x = FloatField  ()
  pos_y = FloatField  ()
  scale = FloatField  ()
  tags  = ListField   (StringField())

class Board(Document):
  id          = UUIDField (auto_fill = True)
  read_only   = UUIDField (auto_fill = True)
  items       = ListField (EmbeddedDocumentField(Item))


