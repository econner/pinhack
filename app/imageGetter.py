from bs4 import BeautifulSoup
import urllib

def getImages(url):
    imageList = []
    if any(url.endswith(x) for x in ('.jpg','.gif','.jpeg')):
        imageList.append(url)
    else:
        if url.startswith('http://') == False:
            url = 'http://' + url

        appendable_url = url
        # If it has a / in the path thats not // then we should truncate to that
        if not appendable_url.endswith('/') and '/' in appendable_url[9:]:
            right_index = appendable_url.rindex('/')
            appendable_url = appendable_url[0:right_index + 1]

        soup = BeautifulSoup(urllib.urlopen(url))
        for link in soup.find_all('img'):
            imageURL = link.get('src')
            if imageURL is not None:
                if imageURL.startswith('http://'):
                    imageList.append(imageURL)
                else:
                    imageList.append(appendable_url + imageURL);

        cur_url = url.replace("http://","")
        last_image_url = "http://api.snapito.com/web/abc123/300x200/" + cur_url+"?fast"
        imageList.append(last_image_url)
    return imageList
