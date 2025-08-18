import spacy 
from rapidfuzz import fuzz
import re

nlp = spacy.load("en_core_web_sm")

skill_dict = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "ruby", "swift", "kotlin",
    "go", "php", "r", "matlab", "sas", "perl", "objective-c", "rust", "dart", "scala",
    "haskell", "erlang", "elixir", "ocaml", "f#", "clojure", "scheme", "lisp",
    "assembly", "fortran", "cobol", "ada", "vhdl", "verilog",
    "shell", "bash", "powershell", "awk", "tcl", "lua",
    "html", "css", "sql", "graphql",
    "solidity", "vyper", "move", "zig", "crystal", "nim", "groovy",
    "vb.net", "visual basic", "delphi", "smalltalk", "abap",
    "cuda", "opencl", "prolog", "mercury", "apl", "forth", "foxpro", "postscript",

    # Frameworks / Libraries / Tools
    "react", "angular", "vue.js", "svelte", "next.js", "nuxt.js", "solidjs",
    "node.js", "express.js", "django", "flask", "fastapi", "spring boot", "ruby on rails", "laravel", "asp.net",
    "react native", "flutter", "ionic", "cordova", "xamarin", "swiftui", "jetpack compose",
    "tailwind css", "bootstrap", "material-ui", "ant design", "chakra ui", "bulma", "foundation",
    "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "plotly", "d3.js",
    "tensorflow", "pytorch", "keras", "hugging face transformers", "opencv", "nltk", "spacy",
    "docker", "kubernetes", "terraform", "jenkins", "gitlab ci/cd", "circleci",
    "postgresql", "mysql", "mongodb", "redis", "cassandra", "elasticsearch", "sqlite", "oracle db", "firebase",
    "junit", "pytest", "selenium", "cypress", "mocha", "jest",

    # Data & Analytics
    "statistical analysis", "excel", "tableau", "power bi", "data analysis", "data management",
    "data entry", "data collection", "database management", "heatmaps", "microsoft clarity", "hotjar",
    "crazy egg", "google analytics", "mixpanel", "responsive design", "accessibility design",
    "machine learning", "deep learning", "nlp", "reinforcement learning", "openai gym",
    "stable baselines", "rllib",

    # Cloud & DevOps
    "aws", "azure", "gcp", "ibm cloud", "cloud infrastructure",
    "serverless computing", "aws lambda", "azure functions",

    # Networking & Security
    "network security", "network protocols", "firewalls", "ids", "ips", "vpn",
    "vulnerability assessment", "penetration testing", "incident response", "digital forensics",

    # UI/UX & Design
    "ui design", "ux design", "web design", "adobe photoshop", "adobe illustrator", "adobe indesign",
    "typography", "layout design", "color theory", "brand identity", "illustration", "custom graphics",
    "image editing", "print design", "wireframing", "interaction design", "prototyping",
    "adobe xd", "sketch", "figma", "invision", "user interviews", "surveys", "usability testing",
    "information design",

    # Digital Marketing / SEO Tools
    "seo", "sem", "google ads", "social media marketing", "content marketing", "blog writing",
    "a/b testing", "marketing automation", "cro", "ux optimization", "influencer marketing"
]


negation_words = ["no", "not", "without", "never", "lack of"]

def skill_extract(paragraph, threshold = 80):
    paragraph = paragraph.lower()
    doc = nlp(paragraph)
    found_skills = []

    for skill in skill_dict:
        # Only match whole words for single-letter skills
        if len(skill) == 1:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, paragraph):
                found_skills.append(skill)
        else:
            similarity = fuzz.partial_ratio(skill.lower(), paragraph)
            if similarity >= threshold:
                # check negation
                pattern = r'\b(?:' + '|'.join(negation_words) + r')\b(?:\s+\w+){0,3}\s+' + re.escape(skill.lower())
                if not re.search(pattern, paragraph):
                    found_skills.append(skill)

    return list(set(found_skills)) # removing duplicates


