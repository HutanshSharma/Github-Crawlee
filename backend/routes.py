from flask import jsonify
from crawlers.main import scrapper
from crawlers.profile import extract as profile_scrap
from crawlers.pulls import extract as pull_scrap
from crawlers.repo import extract as repo_scrap
from crawlers.issue import extract as issue_scrap
from crawlers.commit import extract as commit_scrap
from crawlers.pulse import extract as pulse_scrap
from crawlers.get_all_repos import extract as get_repos
from crawlers.readme import extract as read_me
from readme_reader.skill_ext import skill_extract
from backend import app

repos_data = []

@app.route('/profile/<nickname>')
def profile(nickname):
    link = f"https://github.com/{nickname}?tab=repositories"
    data = scrapper(link,profile_scrap)
    return jsonify(data)

@app.route('/pulls/<nickname>/<repository>')
def pulls(nickname,repository):
    link = f"https://github.com/{nickname}/{repository}/pulls"
    data = scrapper(link,pull_scrap)
    return jsonify(data)

@app.route('/repo/<nickname>/<repository>')
def repo(nickname,repository):
    link = f"https://github.com/{nickname}/{repository}"
    data = scrapper(link,repo_scrap)
    return jsonify(data)

@app.route('/issues/<nickname>/<repository>')
def issues(nickname,repository):
    link = f"https://github.com/{nickname}/{repository}/issues"
    data = scrapper(link,issue_scrap)
    return jsonify(data)

@app.route('/commits/<nickname>/<repository>')
def commits(nickname,repository):
    link = f"https://github.com/{nickname}/{repository}/commits/main/"
    data = scrapper(link,commit_scrap)
    return jsonify(data)

@app.route('/pulse/<nickname>/<repository>')
def pulse(nickname,repository):
    link = f"https://github.com/{nickname}/{repository}/pulse"
    data = scrapper(link,pulse_scrap)
    return jsonify(data)

@app.route('/home/<nickname>')
def home(nickname):
    global repos_data
    mainlink = f"https://github.com/{nickname}?tab=repositories"
    data = scrapper(mainlink,get_repos)
    i=2
    while(1):
        link = f"https://github.com/{nickname}?page={i}&tab=repositories"
        temp = scrapper(link,get_repos)
        if temp:
            data.extend(temp)
        else:
            break
        i+=1

    repos_data = data
    return jsonify(data)

@app.route('/search/<keyword>')
def search(keyword):
    keyword = keyword.lower()
    data = []
    print(repos_data)
    for i in repos_data:
        if keyword in i["name"].lower() or keyword in i["description"].lower():
            data.append(i)

    return jsonify(data)

@app.route('/most_stared')
def most_stared():
    sorted_data = sorted(repos_data,key = lambda x:-x['stars'])
    if len(sorted_data)>10:
        sorted_data = sorted_data[:10]
    
    return jsonify(sorted_data)

@app.route("/language/<lang>")
def search_language(lang):
    lang = lang.lower()
    data = []
    for i in repos_data:
        if lang in i['most_used_language'].lower() or lang in i['languages']:
            data.append(i)

    return jsonify(data)

@app.route("/readme/<username>/<repository>")
def readme(username,repository):
    link = f"https://raw.githubusercontent.com/{username}/{repository}/main/README.md"
    data = scrapper(link,read_me)
    skills = skill_extract(data)
    return jsonify(skills)



