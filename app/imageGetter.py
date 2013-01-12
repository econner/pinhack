from bs4 import BeautifulSoup
import urllib

def getImages(url):
	imageList = []
	if any(url.endswith(x) for x in ('.jpg','.gif','.jpeg')):
		imageList.append(url)
	else:
		if url.startswith('http://') == False:
			url = 'http://' + url
		soup = BeautifulSoup(urllib.urlopen(url))
		for link in soup.find_all('img'):
			imageURL = link.get('src')
			if imageURL is not None:
				if imageURL.startswith('http://'):
					imageList.append(imageURL)
				else:
					imageList.append(url + imageURL);
	return imageList