def extract(soup):
    data = {
        "merges_data":None,
        "merged_pull":0,
        "proposed_pull":0,
        "closed_issues":0,
        "new_issues":0,
        "active_discussions":0
    }

    p = soup.find("div",class_="js-pulse-contribution-data")
    if p:
        strongs = p.find_all("strong")
        strong_data = list()
        for i in strongs:
            text = i.get_text(strip=True)
            strong_data.append(text)

        merges_data = {
            "authors":strong_data[0],
            "commits_pushed_to_main":strong_data[1],
            "commits_pushed_to_all_branches":strong_data[2],
            "files_changed":strong_data[3],
            "additions":strong_data[4],
            "deletions":strong_data[6]
        }
        data['merges_data'] = merges_data

    merged_pull_requests = soup.find("h3",id="merged-pull-requests")
    if merged_pull_requests:
        mpr_span = merged_pull_requests.find("span")
        mpr_inner_spans = mpr_span.find_all('span')
        mpr = {"Pull requests":mpr_inner_spans[0].get_text(strip=True),
            "merged by":mpr_inner_spans[1].get_text(strip=True)}
        data["merged_pull"]=mpr

    proposed_pull_requests = soup.find("h3",id="proposed-pull-requests")
    if proposed_pull_requests:
        ppr_span = proposed_pull_requests.find("span")
        ppr_inner_spans = ppr_span.find_all('span')
        ppr = {"Pull requests":ppr_inner_spans[0].get_text(strip=True),
            "opened by":ppr_inner_spans[1].get_text(strip=True)}
        data["proposed_pull"]=ppr

    closed_issues = soup.find("h3",id="closed-issues")
    if closed_issues:
        ci_span = closed_issues.find("span")
        ci_inner_spans = ci_span.find_all('span')
        ci = {"issues":ci_inner_spans[0].get_text(strip=True),
            "closed by":ci_inner_spans[1].get_text(strip=True)}
        data["closed_issues"]=ci

    new_issues = soup.find("h3",id="new-issues")
    if new_issues:
        ni_span = new_issues.find("span")
        ni_inner_spans = ni_span.find_all('span')
        ni = {"issues":ni_inner_spans[0].get_text(strip=True),
            "opened by":ni_inner_spans[1].get_text(strip=True)}
        data["new_issues"]=ni

    active_discussions = soup.find("h3",class_="conversation-list-heading")
    if active_discussions:
        ad_span = active_discussions.find("span",class_="text-emphasized").get_text(strip=True)
        data["active_discussions"]=ad_span

    return data