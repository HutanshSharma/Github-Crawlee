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
    
    repo_info = {
        "stars": "N/A",
        "forks": "N/A",
        "watchers": 'N/A',
        "description": '',
        "branches": 'N/A',
        "languages": [],
        "topics":[]
    }   

    branch = soup.find_all('a',href=lambda href: href and '/branches' in href)
    if branch:
        branch_count = branch[1].find('strong')
        if branch_count:
            repo_info['branches'] = parse_number(branch_count.get_text(strip=True))

    watchers = soup.find('a',href=lambda href: href and '/watchers' in href)
    if watchers:
        watchers_element = watchers.find('span')
        if not watchers_element:
            watchers_element = watchers.find('strong')
        if watchers_element:
            repo_info['watchers'] = parse_number(watchers_element.get_text(strip=True))
    
    fork_element = soup.find('a',href=lambda href: href and '/forks' in href)
    if fork_element:
        forks_count_element = fork_element.find('span')
        if not forks_count_element:
            forks_count_element = fork_element.find('strong')
        if forks_count_element:
            repo_info['forks'] = parse_number(forks_count_element.get_text(strip=True))

    stars_element = soup.find('a', href=lambda href: href and '/stargazers' in href)
    if stars_element:
        stars_count_element = stars_element.find('span')
        if not stars_count_element:
            stars_count_element = stars_element.find('strong')
        if stars_count_element:
            repo_info['stars'] = parse_number(stars_count_element.get_text(strip=True))

    temp = soup.find('h2',string='Languages')
    if temp:
        languages_list = temp.find_next_sibling('ul', class_='list-style-none')
        if languages_list:
            language_items = languages_list.find_all('li')
            for item in language_items:
                language_name = item.find('span', class_='color-fg-default').get_text(strip=True)
                language_percentage = item.find('span', class_=None).get_text(strip=True)
                repo_info['languages'].append({
                    'name': language_name,
                    'percentage': language_percentage
                })

    sidebar = soup.find('div',class_="Layout-sidebar")
    if sidebar:
        p = sidebar.find('p')
        if p:
            description = p.get_text(strip=True)
            repo_info['description'] = description
        topic_a = sidebar.find_all('a',href=lambda href: href and '/topics' in href)
        topics = []
        if topic_a:
            for i in topic_a:
                text = i.get_text(strip=True)
                topics.append(text)
            
            repo_info['topics'] = topics
            

    return repo_info

