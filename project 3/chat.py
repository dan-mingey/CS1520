from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from werkzeug import check_password_hash, generate_password_hash
from ChatModels import db, User, Message, Chatroom

import os, time, json

app = Flask(__name__)

SECRET_KEY = 'development key'
DEBUG = True

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'chat.db')

app.config.from_object(__name__)
app.config.from_envvar('CHAT_SETTINGS', silent=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.create_all()



@app.route("/")
def default():
    return render_template("homepage.html")



@app.route("/get_new_messages", methods=["POST"])
def get_new_messages():
    t = request.form['current_time']
    t = int(float(t)*0.001)

    chat_room = Chatroom.query.filter_by(chatroom_id=session['current_chatroom_id']).all()
    if len(chat_room) == 0: 
        return "null"
    messages_dict = []
    messages = Message.query.filter_by(message_room_id=session['current_chatroom_id']).all()
    for m in messages:
        #print("\nmessage time stamp")
        #print(m.message_time_stamp)
        #print("\current time stamp")
        #print(t)
        if(m.message_time_stamp > t):
           
            #print("\n\nthis message is new\n\n")
            messages_dict.append(row2dict(m))
        

    #print(messages_dict)
    return json.dumps(messages_dict)



def row2dict(newMessage):
    d = {}
    for column in newMessage.__table__.columns:
        d[column.name] = str(getattr(newMessage, column.name))

    return d

@app.route("/message_sent", methods=["GET", "POST"])
def message_sent():
    print("in messsage sent, this is where it adds the new message to the database")
    message = request.form['message_text']
    t = request.form['current_time']
    t = int(float(t)*0.001)
    currentUser = User.query.filter_by(user_id=session['user_id']).first()
    newMessage = Message(message_text=message, message_room_id=session['current_chatroom_id'], message_creator=currentUser.username, message_time_stamp=t)
    db.session.add(newMessage)
    db.session.commit()

    message_json = []
    message_json.append(row2dict(newMessage))
    return json.dumps(message_json)




@app.route("/chatroom/<ID>")
def join_chatroom(ID):
    currentUser = User.query.filter_by(user_id=session['user_id']).first()
    chatroom_joined = Chatroom.query.filter_by(chatroom_id=ID).first()
    session['current_chatroom_id'] = chatroom_joined.chatroom_id

    # GET ALL THE MESSAGES FROM THE DATABASE, CONVERT THEM TO JSON AND SEND THEM TO FILE

    messages = Message.query.filter_by(message_room_id=session['current_chatroom_id']).all()
    return render_template("chatroom.html", Chatroom=chatroom_joined, Messages=messages)

@app.route("/ChatPage/<ID>")
def remove_chatroom(ID):
    currentUser = User.query.filter_by(user_id=session['user_id']).first()
    chatroomToRemove = Chatroom.query.filter_by(chatroom_id=ID).first()
    db.session.delete(chatroomToRemove)
    db.session.commit()
    return redirect(url_for('chatpage'))


@app.route("/chatpage", methods=["GET", "POST"])
def chatpage():
    session['current_chatroom_id'] = -1
    if request.method == 'POST':
        #check if the user created a chatroom
        if 'create_chatroom' in request.form:
            chatroom_name = request.form['chatroom_name']
            #print(chatroom_name)
            #check to make sure they actually enter a chatroom name
            #print(session['user_id'])
            currentUser = User.query.filter_by(user_id=session['user_id']).first()
            chatroom = Chatroom(chatroom_name, currentUser.username)
            #print(chatroom.chatroom_creator)
            #add the chatroom to the database
            db.session.add(chatroom)
            db.session.commit()

    #check if there are existing chatrooms
    allChatrooms = Chatroom.query.all()
    if len(allChatrooms) > 0:
        #if there are chatrooms, show the available chat rooms they can join
        currentUser = User.query.filter_by(user_id=session['user_id']).first()
        return render_template("ChatPage.html", noChatrooms=False, chatrooms=allChatrooms, currentUser=currentUser.username)
    # else
    else:
        #display message saying there is no chatrooms
        return render_template("ChatPage.html", noChatrooms=True)

        #   create a new chat room


        # if the user created any chatrooms
            # delete any chatroom that the user



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        usernameEntered = request.form['username']
        user = User.query.filter_by(username=usernameEntered).first()

        if user is None:
            flash("invalid username")
        elif not check_password_hash(user.pw_hash, request.form['password']):
            flash("invalid password")
        else:
            session['user_id'] = user.user_id
            return redirect(url_for('chatpage'))
    return render_template("login.html")



@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        user = User(request.form['username'],generate_password_hash(request.form['password']))
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template("register.html")


@app.route("/logout")
def logout():
    session['user_id'] = ""
    return redirect(url_for('default'))



if __name__ == 'main':
    app.run(debug=True)
