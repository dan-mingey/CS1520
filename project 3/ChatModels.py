from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), nullable=False)
    pw_hash = db.Column(db.String(64), nullable=False)
    messages = db.relationship('Message', backref='writer')


    def __init__(self, username, password):
        self.username = username
        self.pw_hash = password

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Message(db.Model):
    # message id
    message_id = db.Column(db.Integer, primary_key=True)
    # creator of message
    message_creator = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    # room id for message
    message_room_id = db.Column(db.Integer, db.ForeignKey('chatroom.chatroom_id'))
    # message text
    message_text = db.Column(db.String(120), nullable=False)
    # time stamp of message created
    message_time_stamp = db.Column(db.Integer, nullable=False)



    def __init__(self, message_creator, message_room_id, message_text, message_time_stamp):
        self.message_creator = message_creator
        self.message_room_id = message_room_id
        self.message_text = message_text
        self.message_time_stamp = message_time_stamp


    def __repr__(self):
        return '<Message {}>'.format(self.message_text)

class Chatroom(db.Model):
    #chatroom id
    chatroom_id = db.Column(db.Integer, primary_key=True)

    #chatroom name
    chatroom_name = db.Column(db.Integer, nullable=False)

    #creator of chatroom
    chatroom_creator = db.Column(db.String(24), nullable=False)

    messages = db.relationship('Message', backref='chatroom')


    def __init__(self, chatroom_name, chatroom_creator):
        self.chatroom_name = chatroom_name
        self.chatroom_creator = chatroom_creator

    def __repr__(self):
        return '<Chatroom {}>'.format(self.chatroom_creator)
