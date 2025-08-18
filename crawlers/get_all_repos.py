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
                    star_tag = i.find("a",href=lambda href: href and '/stargazers' in href)
                    stars = star_tag.get_text(strip=True) if star_tag else 0
                    lang_tag = i.select_one('span[itemprop="programmingLanguage"]')
                    most_used_language = lang_tag.get_text(strip=True) if lang_tag else "N/A"
                    languages = i.select_one("div.topics-row-container")
                    langanchor = languages.select("a") if languages else []
                    langlist = [j.get_text(strip=True).lower() for j in langanchor]
                    updated_at = i.select_one("relative-time")["title"]

                    data.append({'name':repo_name,
                                 'description':description,
                                 'link':repo_link,
                                 'stars':int(stars),
                                 'most_used_language':most_used_language,
                                 "languages":langlist,
                                 "updated_at":updated_at})

    return data