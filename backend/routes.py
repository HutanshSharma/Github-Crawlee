from flask import request, jsonify
from crawlers.main import scrapper
from crawlers.profile import extract as profile_scrap
from crawlers.pulls import extract as pull_scrap
from crawlers.repo import extract as repo_scrap
from crawlers.issue import extract as issue_scrap
from crawlers.commit import extract as commit_scrap
from backend import app

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