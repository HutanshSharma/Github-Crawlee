def extract(soup):
    data = {}

    username = soup.select_one("span.p-name").get_text(strip=True)
    if username:
        data['username']=username
    nickname = soup.select_one("span.p-nickname").get_text(strip=True)
    if nickname:
        data['nickname']=nickname

    followersanchor = soup.find("a",{"href":f"https://github.com/{nickname}?tab=followers"})
    if followersanchor:
        followers = followersanchor.select_one("span").get_text(strip=True)
        data['followers']=followers

    followinganchor = soup.find("a",{"href":f"https://github.com/{nickname}?tab=following"})
    if followinganchor:
        following = followinganchor.select_one("span").get_text(strip=True)
        data['following']=following

    repos = soup.find("ul", {
        "data-filterable-for": "your-repos-filter",
        "data-filterable-type": "substring"
    })

    if repos:
        repo_items = repos.find_all('li')

        repolist = list()
        for i in repo_items:
            repo = dict()
            repo_name = i.select_one("a").get_text(strip=True)
            lang_tag = i.select_one('span[itemprop="programmingLanguage"]')
            most_used_language = lang_tag.get_text(strip=True) if lang_tag else "N/A"
            updated_at = i.select_one("relative-time")["title"]
            star_tag = i.select_one("a.Link--muted")
            stars = star_tag.get_text(strip=True) if star_tag else 0
            languages = i.select_one("div.topics-row-container")
            langanchor = languages.select("a") if languages else []
            langlist = [j.get_text(strip=True) for j in langanchor]

            repo['name']=repo_name
            repo['updated_at']=updated_at
            repo['stars']=stars
            repo['languages']=langlist
            repo['most_used_language']=most_used_language
            repolist.append(repo)
        
        data['repos_list']=repolist

    return data

