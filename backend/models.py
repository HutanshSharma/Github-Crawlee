from backend import db

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(20),unique=True,nullable=False)
    email=db.Column(db.String(120),unique=True,nullable=False)
    password=db.Column(db.String(60),nullable=False)
    image_file=db.Column(db.String(20),nullable=False,default="default.png")
    platforms=db.relationship("Platform",backref="user",lazy=True,cascade="all,delete")

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"
    
class Platform(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    platform_name =db.Column(db.String(100),unique=True,nullable=False)
    base_url=db.Column(db.text,nullable=False)

    def __repr__(self):
        return f"Platform({self.platform_name}) base_url({self.base_url})"
