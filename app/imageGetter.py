from bs4 import BeautifulSoup
import urllib

def getImages(url):
	imageList = []
	soup = BeautifulSoup(urllib.urlopen(url))
	for link in soup.find_all('img'):
		imageURL = link.get('src')
		if imageURL is not None:
			if imageURL.startswith('http://'):
				imageList.append(imageURL)
			else:
				imageList.append(url + imageURL);
	return imageList