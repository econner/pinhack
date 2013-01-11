from bs4 import BeautifulSoup
import urllib

def getImages(url):
	imageList = []
	soup = BeautifulSoup(urllib.urlopen(url))
	for link in soup.find_all('img'):
		imageURL = link.get('src')
		if imageURL is not None:
			imageList.append(imageURL)
	return imageList

url = 'http://songofstyle.blogspot.com'
imageList = getImages(url)
for x in imageList:
	print(x)