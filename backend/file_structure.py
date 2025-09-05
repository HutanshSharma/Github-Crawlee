import requests
import zipfile
import io
import os

def build_tree(path):
    tree = {}
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            tree[item] = build_tree(item_path)
        else:
            tree[item] = None
    return tree


def get_repo_structure(owner, repo, branch="main"):
    url = f"https://github.com/{owner}/{repo}/archive/refs/heads/{branch}.zip"
    response = requests.get(url)
    response.raise_for_status()

    with zipfile.ZipFile(io.BytesIO(response.content)) as z:
        z.extractall("repo_temp")

    folder_name = f"{repo}-{branch}"
    base_path = os.path.join("repo_temp", folder_name)

    file_tree = build_tree(base_path)
    return file_tree

