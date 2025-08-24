def parse_number(s: str) -> float:
    s = s.strip().lower()
    multipliers = {
        'k': 1_000,
        'm': 1_000_000,
        'b': 1_000_000_000,
    }
    if s[-1] in multipliers:
        return float(s[:-1]) * multipliers[s[-1]]
    else:
        return float(s.replace(",", ""))

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
            description = i.select_one('p[itemprop="description"]')
            description_text = description.get_text(strip=True) if description else ''
            star_tag = i.find("a",href=lambda href: href and '/stargazers' in href)
            stars = parse_number(star_tag.get_text(strip=True)) if star_tag else 0
            languages = i.select_one("div.topics-row-container")
            langanchor = languages.select("a") if languages else []
            langlist = [j.get_text(strip=True) for j in langanchor]

            repo['name']=repo_name
            repo['updated_at']=updated_at
            repo['stars']=stars
            repo['languages']=langlist
            repo['most_used_language']=most_used_language
            repo['description'] = description_text
            repolist.append(repo)
        
        data['repos_list']=repolist

    return data

