def extract(soup):
    data = soup.find('pre').get_text(strip=True)
    return data
