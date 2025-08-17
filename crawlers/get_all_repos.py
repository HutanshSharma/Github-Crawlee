def extract(soup):
    div = soup.find("div",id="user-repositories-list")
    data = []
    if div:
        ul = div.find("ul")
        if ul:
            li = ul.find_all('li')
            if li:
                for i in li:
                    repo = i.select_one('a')
                    repo_link = repo.get("href")
                    repo_name = repo.get_text(strip=True)
                    repo_description = i.find("p",{"itemprop":"description"})
                    description = repo_description.get_text(strip=True) if repo_description else ''
                    star_tag = i.select_one("a.Link--muted")
                    stars = star_tag.get_text(strip=True) if star_tag else 0

                    data.append({'name':repo_name,'description':description,'link':repo_link,'stars':int(stars)})

    return data