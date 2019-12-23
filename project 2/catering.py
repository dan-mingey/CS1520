from datetime import datetime
import os
from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from CateringModels import db, User, Event
from werkzeug import check_password_hash, generate_password_hash
app = Flask(__name__)


SECRET_KEY='development key'
DEBUG = True

SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'catering.db')

app.config.from_object(__name__)
app.config.from_envvar('CATERING_SETTINGS', silent=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #here to silence deprecation warning



db.init_app(app)

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.create_all()
    print('Initialized the database.')
    user = User('owner',generate_password_hash('pass'),'owner')
    db.session.add(user)
    db.session.commit()

@app.route("/")
def default():
    return render_template("homepage.html")


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
            return redirect(url_for(user.type))
    return render_template("login.html")


@app.route("/customer",methods=["GET","POST"])
def customer():
    currentUser = User.query.filter_by(user_id=session['user_id']).first()
    events = Event.query.filter_by(event_creator=currentUser.username).all()
    if request.method == 'POST':
        #the user requested a new event
        #if request.form['submit_event'] == 'request_event':
        if 'submit_event' in request.form:
            #print(session['user_id'])
            currentUser = User.query.filter_by(user_id=session['user_id']).first()
            event = Event(request.form['event_name'], request.form["event_date"], currentUser.username, 0)
            
            allEvents = Event.query.all()
            badDate=False
            if len(allEvents) > 0:
                for e in allEvents:
                    if(e.event_date == event.event_date):
                        badDate=True

                if not badDate:
                    db.session.add(event)
                    db.session.commit()
                events = Event.query.filter_by(event_creator=currentUser.username).all()

                return render_template("customer.html", userEvents=events, invalidDate=badDate)
            else:
                db.session.add(event)
                db.session.commit()

            events = Event.query.filter_by(event_creator=currentUser.username).all()

            return render_template("customer.html", userEvents=events, invalidDate=False)
            #check to see if it is on another date
            #if it isnt, create the event
        #check if the the user requested to cancel the event



    return render_template("customer.html", userEvents=events)

@app.route("/customer/<ID>")
def cancel_event(ID):
    currentUser = User.query.filter_by(user_id=session['user_id']).first()
    eventToRemove = Event.query.filter_by(event_id=ID).first()
    db.session.delete(eventToRemove)
    db.session.commit()
    events = Event.query.filter_by(event_creator=currentUser.username).all()
    return redirect(url_for('customer', userEvents=events))


@app.route("/logout")
def logout():
    session['user_id'] = ""
    return redirect(url_for('default'))

@app.route("/owner",methods=["GET","POST"])
def owner():
    if request.method == 'POST':
        user = User(request.form['staff_username'],generate_password_hash(request.form['staff_password']), type='staff')
        db.session.add(user)
        db.session.commit()


    allEvents = Event.query.all()
    return render_template("owner.html", events=allEvents)


@app.route("/staff/<ID>")
def sign_up(ID):

    event = Event.query.filter_by(event_id=ID).first()
    user = User.query.filter_by(user_id=session['user_id']).first()
    event.staffers.append(user)
    event.event_staffers = event.event_staffers + 1
    db.session.commit()

    return redirect(url_for('staff'))


@app.route("/staff",methods=["GET","POST"])
def staff():

    allEvents = Event.query.all()
    staffList = []
    for event in allEvents:
        if event.staffers is not None:
            for user in event.staffers:
                if user.user_id == session['user_id']:
                    staffList.append(event)


    AvailableEvents = Event.query.filter(Event.event_staffers<3).all()

    list = []

    for event in AvailableEvents:
        list.append(event)
        for user in event.staffers:
            if user.user_id == session['user_id']:
                list.remove(event)

    return render_template("staff.html", AvailableEvents=list, ScheduledEvents=staffList)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        user = User(request.form['username'],generate_password_hash(request.form['password']), type='customer')
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template("register.html")


if __name__ == 'main':
    app.run(debug=True)
