def extract(soup):
    div = soup.find('div',id="js-issues-toolbar")
    anchor = div.find_all("a",href=lambda href: href and '/pulls' in href)
    open = anchor[0].get_text(strip=True)
    closed = anchor[1].get_text(strip=True)
    milestones = soup.find('a',href=lambda href: href and '/milestones' in href)
    milestones_number = milestones.select_one('span').get_text(strip=True)
    labels = soup.find('a',href=lambda href: href and '/labels' in href)
    labels_number = labels.select_one('span').get_text(strip=True)
    
    pulls = dict()
    pulls['open'] = open.split(' ')[0]
    pulls['closed'] = closed.split(' ')[0]
    pulls['labels'] = labels_number
    pulls['milestones'] = milestones_number
    return pulls
