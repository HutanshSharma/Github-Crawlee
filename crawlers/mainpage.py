from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def build_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
            },
        )
    except Exception:
        pass

    return driver

# ---------- JS to grab full HTML including open shadowRoots ----------
GET_FULL_DOM_JS = r"""
function getShadowDOMContent(element) {
  let content = "";
  if (!element) return content;
  if (element.shadowRoot) {
    content += "<shadow-root-start>";
    content += element.shadowRoot.innerHTML;
    content += "<shadow-root-end>";
    let children = element.shadowRoot.querySelectorAll("*");
    children.forEach(child => {
      content += getShadowDOMContent(child);
    });
  } else {
    let children = element.querySelectorAll("*");
    children.forEach(child => {
      if (child.shadowRoot) {
        content += getShadowDOMContent(child);
      }
    });
  }
  return content;
}

let fullHTML = document.documentElement.outerHTML;
let all = document.querySelectorAll("*");
all.forEach(el => {
  if (el.shadowRoot) {
    fullHTML += getShadowDOMContent(el);
  }
});
return fullHTML;
"""

# ---------- main scraping function ----------
def scrapper(playlist_url, max_wait=100):
    driver = build_driver()
    try:
        driver.get(playlist_url)
        time.sleep(2)
        prev_count = -1
        stable_iterations = 0
        start = time.time()
        while True:
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            time.sleep(1.5)
            try:
                count = driver.execute_script(
                    "return document.querySelectorAll('#contents ytd-playlist-video-renderer').length"
                )
            except Exception:
                count = 0

            if count == prev_count:
                stable_iterations += 1
            else:
                stable_iterations = 0

            prev_count = count

            if stable_iterations >= 3 or (time.time() - start) > max_wait:
                break
        full_html = driver.execute_script(GET_FULL_DOM_JS)

    finally:
        driver.quit()

    soup = BeautifulSoup(full_html, "html.parser")

    data = dict()

    username = soup.select_one("span.p-name").get_text(strip=True)
    nickname = soup.select_one("span.p-nickname").get_text(strip=True)
    data['username']=username
    data['nickname']=nickname

    followersanchor = soup.find("a",{"href":f"https://github.com/{nickname}?tab=followers"})
    followers = followersanchor.select_one("span").get_text(strip=True)
    followinganchor = soup.find("a",{"href":f"https://github.com/{nickname}?tab=following"})
    following = followinganchor.select_one("span").get_text(strip=True)
    data['followers']=followers
    data['following']=following

    repos = soup.find("ul", {
        "data-filterable-for": "your-repos-filter",
        "data-filterable-type": "substring"
    })

    repo_items = repos.find_all('li')

    repolist = list()
    for i in repo_items:
        repo = dict()
        repo_name = i.select_one("a").get_text(strip=True)
        lang_tag = i.select_one('span[itemprop="programmingLanguage"]')
        most_used_language = lang_tag.get_text(strip=True) if lang_tag else "N/A"
        updated_at = i.select_one("relative-time")["title"]
        star_tag = i.select_one("a.Link--muted")
        stars = star_tag.get_text(strip=True) if star_tag else 0
        languages = i.select_one("div.topics-row-container")
        langanchor = i.select("a") if languages else []
        langlist = [j.get_text(strip=True) for j in langanchor]

        repo['name']=repo_name
        repo['updated_at']=updated_at
        repo['stars']=stars
        repo['languages']=langlist
        repo['most_used_language']=most_used_language
        repolist.append(repo)
    
    data['total_public_repos'] = len(repolist)
    data['repos_list']=repolist

    return data

# ---------- run and fallback ----------
if __name__ == "__main__":
    link = "https://github.com/DZDasherKTB?tab=repositories"  # replace if needed
    data = scrapper(link)

    print(data)
    

