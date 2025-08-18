import spacy 
from rapidfuzz import fuzz
import re
import json

nlp = spacy.load("en_core_web_sm")

skill_dict = [
    "python", "java", "c++", "sql", "machine learning",
    "data analysis", "project management", "communication",
    "leadership", "teamwork", "excel", "deep learning"
]

negation_words = ["no", "not", "without", "never", "lack of"]

def skill_extract(paragraph, threshold = 80):
    paragraph = paragraph.lower()
    doc = nlp(paragraph)
    print(doc)
    found_skills = []

    for skill in skill_dict:
        similarity = fuzz.partial_ratio(skill.lower(), paragraph)  # even if there is some typo in skill name it will detect it 
        print(f'{skill.lower()}-- {similarity}')
        if similarity >= threshold:
            pattern = r'\b(?:' + '|'.join(negation_words) + r')\b(?:\s+\w+){0,3}\s+' + re.escape(skill.lower())
            if not re.search(pattern, paragraph):
                found_skills.append(skill)


    return list(set(found_skills)) # removing duplicates

if __name__ == "__main__":
    
    test_paragraph = """I have experience in Pythn, SQL, and project management.
                        I have no experience in Java. My leadership and communication skills are strong."""
    
    print("Paragraph:\n", test_paragraph)
    skills = skill_extract(test_paragraph)

    with open("extracted_skills", "w") as json_file:
        json.dump(skills, json_file, indent = 4)
    print("\nExtracted Skills:", skills)

