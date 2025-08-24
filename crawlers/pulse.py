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
    data = {
        "merges_data":{
            "authors":1,
            "commits_pushed_to_main":0,
            "commits_pushed_to_all_branches":0,
            "files_changed":0,
            "additions":0,
            "deletions":0,
        },
        "merged_pull":{
            "Pull requests":0,
            "merged by":0
        },
        "proposed_pull":{
            "Pull requests":0,
            "opened by":0
        },
        "closed_issues":{
            "issues":0,
            "closed by":0
        },
        "new_issues":{
            "issues":0,
            "opened by":0
        },
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
        mpr = {"Pull requests":parse_number(mpr_inner_spans[0].get_text(strip=True)),
            "merged by":parse_number(mpr_inner_spans[1].get_text(strip=True))}
        data["merged_pull"]=mpr

    proposed_pull_requests = soup.find("h3",id="proposed-pull-requests")
    if proposed_pull_requests:
        ppr_span = proposed_pull_requests.find("span")
        ppr_inner_spans = ppr_span.find_all('span')
        ppr = {"Pull requests":parse_number(ppr_inner_spans[0].get_text(strip=True)),
            "opened by":parse_number(ppr_inner_spans[1].get_text(strip=True))}
        data["proposed_pull"]=ppr

    closed_issues = soup.find("h3",id="closed-issues")
    if closed_issues:
        ci_span = closed_issues.find("span")
        ci_inner_spans = ci_span.find_all('span')
        ci = {"issues":parse_number(ci_inner_spans[0].get_text(strip=True)),
            "closed by":parse_number(ci_inner_spans[1].get_text(strip=True))}
        data["closed_issues"]=ci

    new_issues = soup.find("h3",id="new-issues")
    if new_issues:
        ni_span = new_issues.find("span")
        ni_inner_spans = ni_span.find_all('span')
        ni = {"issues":parse_number(ni_inner_spans[0].get_text(strip=True)),
            "opened by":parse_number(ni_inner_spans[1].get_text(strip=True))}
        data["new_issues"]=ni

    active_discussions = soup.find("h3",class_="conversation-list-heading")
    if active_discussions:
        ad_span = parse_number(active_discussions.find("span",class_="text-emphasized").get_text(strip=True))
        data["active_discussions"]=ad_span

    return data