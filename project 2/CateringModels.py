from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

staff_for_events = db.Table('staff_for_events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id')),
    db.Column('event_id', db.Integer, db.ForeignKey('event.event_id'))
)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), nullable=False)
    pw_hash = db.Column(db.String(64), nullable=False)
    type = db.Column(db.String(24), nullable=False)


    def __init__(self, username, password, type):
        self.username = username
        self.pw_hash = password
        self.type = type

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Event(db.Model):
    event_id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(64), nullable=False)
    event_date = db.Column(db.String(64), nullable=False)
    event_creator = db.Column(db.String(64), nullable=False)
    event_staffers = db.Column(db.Integer)
    staffers = db.relationship('User', secondary=staff_for_events, backref=db.backref('events', lazy='dynamic'))


    def __init__(self,event_name,event_date, event_creator, event_staffers):
        self.event_name = event_name
        self.event_date = event_date
        self.event_creator = event_creator
        self.event_staffers = event_staffers

    def __repr__(self):
        return '<Event {}>'.format(self.event_name)
