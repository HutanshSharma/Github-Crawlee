def extract(soup):
    pulls = {
        "open":0,
        "closed":0,
        "milestones":0,
        "labels":0
    }
    div = soup.find('div',id="js-issues-toolbar")
    if div:
        anchor = div.find_all("a",href=lambda href: href and '/pulls' in href)
        if anchor:
            open = anchor[0].get_text(strip=True)
            closed = anchor[1].get_text(strip=True)
            pulls['open'] = open.split(' ')[0]
            pulls['closed'] = closed.split(' ')[0]

    milestones = soup.find('a',href=lambda href: href and '/milestones' in href)
    if milestones:
        milestones_number = milestones.select_one('span').get_text(strip=True)
        pulls['milestones'] = milestones_number
    labels = soup.find('a',href=lambda href: href and '/labels' in href)
    if labels:
        labels_number = labels.select_one('span').get_text(strip=True)
        pulls['labels'] = labels_number
    
    return pulls
