from bs4 import BeautifulSoup
import urllib

def getImages(url):
	imageList = []
	if any(url.endswith(x) for x in ('.jpg','.gif','.jpeg')):
		imageList.append(url)
	else:
		soup = BeautifulSoup(urllib.urlopen(url))
		for link in soup.find_all('img'):
			imageURL = link.get('src')
			if imageURL is not None:
				if imageURL.startswith('http://'):
					imageList.append(imageURL)
				else:
					imageList.append(url + imageURL);
	cur_url = url.replace("http://","")
	last_image_url = "http://api.snapito.com/web/abc123/300x200/" + cur_url+"?fast"
	imageList.append(last_image_url)
	return imageList
