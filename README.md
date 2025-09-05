# GitHub Crawlee 

## Overview  
This project is a GitHub profile and repository analyzer that crawls a user’s GitHub profile and scrapes detailed information about their activity, repositories, and code structure. The backend uses **Flask, Selenium, and BeautifulSoup** to extract data, while the frontend is built in **React** to visualize the information.  

The application provides:  
- User profile overview (repositories, stars, followers, following)  
- Graphs of activity and languages used  
- Repository insights (file structure, stars, commit pulse, reviews)  
- **Search functionality to filter repositories by name, description, and language**  
- Interactive visualizations for better understanding of GitHub profiles  

---

## Tech Stack  
- **Frontend:** React, JavaScript, Vite (for fast builds and development)  
- **Backend:** Flask (Python)  
- **Scraping Tools:** Selenium, BeautifulSoup  
- **Data Handling:** REST API between Flask and React  

---

## Features  
- Scrapes user profile details (repositories, followers, following, stars)  
- Visualizes activity graphs and language usage charts  
- Provides per-repository details such as file structure, commit pulse, and stars  
- Backend API to fetch scraped data dynamically  
- **Search feature to quickly find repositories by keywords in their name, description, or language**  
- Interactive frontend to explore insights easily  

---

## Setup and Installation  

### Prerequisites  
- Python
- Node.js (with npm or yarn)  
- Git  

---

### Setup  
1. Clone this repository:  
   ```bash
   git clone https://github.com/your-username/github-crawler.git
   cd github-crawler
   ```

2. Create a virtual environmnet and move to it then run:
   ```bash
    pip install -r requirements.txt
   ```

3. Run backend:
   ```bash
     python run.py
   ```

4. Intsall dependencies:
   ```bash
     cd frontend
     npm install
     npm run dev
   ```

### Usage
1. Start both the backend and frontend servers.
2. Open the React app in your browser.
3. Enter a GitHub username to crawl and analyze.
4. Explore the visualizations of their profile and repositories.
5. Use the search bar to filter repositories by keywords in their name, description, or primary language.
