import datetime
from dictshield.document import Document, EmbeddedDocument
from dictshield.fields import UUIDField, StringField, FloatField, BooleanField
from dictshield.fields.compound import ListField, EmbeddedDocumentField

from redis_connection import redis_conn as r

class Item(EmbeddedDocument):
  id     = UUIDField    (auto_fill  = True)
  url    = StringField  (max_length = 300)
  pos_x  = FloatField   ()
  pos_y  = FloatField   ()
  scale  = FloatField   ()
  tags   = ListField    (StringField())
  locked = BooleanField (default=True)

class Board(Document):
  id          = UUIDField (auto_fill = True)
  read_only   = UUIDField (auto_fill = True)
  items       = ListField (EmbeddedDocumentField(Item))

  @classmethod
  def get_from_db(cls, board_id):
    #TODO: Convert to board
    return r.get("b_%s" % board_id)

