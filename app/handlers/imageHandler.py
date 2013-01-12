#from redis_connection import redis_conn as r
import tornado.web
import imageGetter
import json

class ImageHandler(tornado.web.RequestHandler):
	def get(self):
		imageURLs = imageGetter.getImages(self.get_argument('url'))
		self.write(json.dumps(imageURLs))
