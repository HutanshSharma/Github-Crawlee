def extract(soup):
    issues = {
        "open":0,
        "closed":0
    }

    div = soup.find('div',class_="ListItems-module__listContainer--sgptj")
    if div:
        anchor = div.find_all("a",href=lambda href: href and '/issues' in href)
        if anchor:
            open = anchor[0].select_one('span').get_text(strip=True)
            closed = anchor[1].select_one('span').get_text(strip=True)
            issues['open'] = int(open)
            issues['closed'] = int(closed)

    return issues