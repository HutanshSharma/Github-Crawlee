from main import scrapper

def extract(soup):
    
    repo_info = {
        "stars": "N/A",
        "forks": "N/A",
        "watchers": 'N/A',
        "languages": []
    }

    # Extracting the stars count
    watchers = soup.find('a',href=lambda href: href and '/watchers' in href)
    print(watchers)
    if watchers:
        watchers_element = watchers.find('span')
        if not watchers_element:
            watchers_element = watchers.find('strong')
        if watchers_element:
            repo_info['watchers'] = watchers_element.get_text(strip=True)
    
    fork_element = soup.find('a',href=lambda href: href and '/forks' in href)
    if fork_element:
        forks_count_element = fork_element.find('span')
        if not forks_count_element:
            forks_count_element = fork_element.find('strong')
        if forks_count_element:
            repo_info['forks'] = forks_count_element.get_text(strip=True)

    stars_element = soup.find('a', href=lambda href: href and '/stargazers' in href)
    if stars_element:
        stars_count_element = stars_element.find('span')
        if not stars_count_element:
            stars_count_element = stars_element.find('strong')
        if stars_count_element:
            repo_info['stars'] = stars_count_element.get_text(strip=True)


    languages_list = soup.find('h2', string='Languages').find_next_sibling('ul', class_='list-style-none')
    if languages_list:
        language_items = languages_list.find_all('li')
        for item in language_items:
            language_name = item.find('span', class_='color-fg-default').get_text(strip=True)
            language_percentage = item.find('span', class_=None).get_text(strip=True)
            repo_info['languages'].append({
                'name': language_name,
                'percentage': language_percentage
            })

    return repo_info
    

if __name__=="__main__":
    link = "https://github.com/DZDasherKTB/movie_recommendation_system"
    data = scrapper(link,extract)
    print(data)