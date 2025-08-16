from main import scrapper

def extract(soup):
    div = soup.find('div',class_="ListItems-module__listContainer--sgptj")
    anchor = div.find_all("a",href=lambda href: href and '/issues' in href)
    open = anchor[0].select_one('span').get_text(strip=True)
    closed = anchor[1].select_one('span').get_text(strip=True)
    
    issues = dict()
    issues['open'] = open
    issues['closed'] = closed
    return issues

if __name__ == "__main__":
    link = "https://github.com/elder-plinius/L1B3RT4S/issues"
    data = scrapper(link,extract)
    print(data)