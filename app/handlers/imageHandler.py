#from redis_connection import redis_conn as r
import tornado.web
import imageGetter
import json

class ImageHandler(tornado.web.RequestHandler):
	def get(self):
		link = self.get_argument('url')
		if endings(link) in ('.jpg','.jpeg','.gif'):
			print link
		#mageURLs = imageGetter.getImages(self.get_argument('url'))
		#elf.write(json.dumps(imageURLs))
