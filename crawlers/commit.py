def extract(soup):
    commit_data = dict()

    data = soup.find_all("div",class_="mt-0 prc-Timeline-TimelineBody-WWZY0")
    print(len(data))
    for i in data:
        date = i.select_one("h3").get_text(strip=True)
        date_stripped = date[11:]
        ul = i.find('ul')
        li = ul.find_all('li')
        commit_data[date_stripped] = len(li)
    return commit_data