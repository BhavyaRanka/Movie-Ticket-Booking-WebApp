from flask import Flask, render_template, redirect, request, session, url_for, jsonify, send_file,flash
from werkzeug.security import generate_password_hash,check_password_hash
import sqlite3
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from celery_worker import make_celery
from celery.result import AsyncResult
from celery.schedules import crontab
import time
import csv
from json import dumps
from datetime import date,datetime

from httplib2 import Http
# import projectdb


app = Flask(__name__)

jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = "Newproject" 
app.config['SECRET_KEY'] = 'HELLO@54'
app.config["JWT_TOKEN_LOCATION"] = ['headers', 'query_string']

# app.config.update(
#     CELERY_BROKER_URL='redis://localhost:6379',
#     CELERY_RESULT_BACKEND='redis://localhost:6379'
# )

celery = make_celery(app)



@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(crontab(hour=22, minute=17), daily_reminders.s(), name="Reminder to check new shows")
    
    sender.add_periodic_task(crontab(0, 0, day_of_month='20'),Monthly_user_report.s(),name="Report of tickets booked")

@celery.task()
def Monthly_user_report():
    fields=["name","theater","place","show","ticketsBooked","price"]
    conn = sqlite3.connect("ticketapp.db")
    cur = conn.cursor()
    query = """Select * from ticketsBooked"""
    cur.execute(query)
    rows = []
    for i in cur:
      rows.append(list(i))
    with open("static/monthly_report.csv", 'w') as csvfile:
        # creating a csv writer object
        csvwriter = csv.writer(csvfile)
        
        # writing the fields
        csvwriter.writerow(fields)
        
        # writing the data rows
        csvwriter.writerows(rows)
    
    
    return "This task will generate a report of the tickets booked by the user."

@celery.task()
def daily_reminders():
    """Hangouts Chat incoming webhook quickstart."""
    url = 'https://chat.googleapis.com/v1/spaces/AAAAUzTDT7I/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=eIbq-zDPOcZJeEeazt8IPTdq8LKmPJbb88XkCcipsnU'
    bot_message = {
        'text': 'Hi, Check out new shows available'}
    message_headers = {'Content-Type': 'application/json; charset=UTF-8'}
    http_obj = Http()
    response = http_obj.request(
        uri=url,
        method='POST',
        headers=message_headers,
        body=dumps(bot_message),
    )
    print(response)

@celery.task
def generate_csv():
    # importing the csv module
    
    time.sleep(6)
    username = session['username']
    print(username)
    conn = sqlite3.connect("ticketapp.db")
    cur = conn.cursor()
    query = """Select * from ticketsBooked where name=? """
    cur.execute(query, (username, ))
    
    
    
    fields=[]
    for c in cur.description:
        fields.append(c[0])
    print(fields)
    
    rows=[]
    for r in cur:
        rows.append(list(r))
    print(rows)
    # writing to csv file
    with open("static/data.csv", 'w') as csvfile:
        # creating a csv writer object
        csvwriter = csv.writer(csvfile)
        
        # writing the fields
        csvwriter.writerow(fields)
        
        # writing the data rows
        csvwriter.writerows(rows)

    return "Job Started..."

@app.before_request
def require_login():
  allowed_routes = ['login', 'register','adminlogin']
  if request.endpoint not in allowed_routes and 'username' not in session:
    return redirect('/login')


@app.route("/logout")
def logout():
  session["username"] = None
  return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == "POST":
    username = request.form['username']
    password = request.form['password']
    conn = sqlite3.connect("ticketapp.db")
    cur = conn.cursor()
    query = """SELECT * FROM users WHERE username=?"""
    cur.execute(query, (username,))
    rows = cur.fetchone()
    conn.close()
    if not rows:
        return redirect(url_for('register'))
    if check_password_hash(rows[3], password):
      #set session
      session['username'] = username
      access_token=create_access_token(identity=username)
      return redirect(url_for('feed',jwt=access_token))
    else:
      return redirect(url_for('register'))
  return render_template('login.html')



@app.route('/adminlogin', methods=['GET', 'POST'])
def adminlogin():
  if request.method == "POST":
    username = request.form['username']
    password = request.form['password']
    conn = sqlite3.connect("ticketapp.db")
    cur = conn.cursor()
    query = """SELECT * FROM admin WHERE username=?"""
    cur.execute(query, (username,))
    rows = cur.fetchone()
    print(rows)
    conn.close()
    if not rows:
        return redirect(url_for('register'))
    if password==rows[2]:
      #set session
      session['username'] = username
      access_token=create_access_token(identity=username)
      return redirect(url_for('admindashboard',jwt=access_token))
    else:
      return redirect(url_for('register'))
  return render_template('adminlogin.html')



@app.route('/register', methods=['GET', 'POST'])
def register():
  if request.method == "POST":
    try:
      name = request.form['name']
      username = request.form['username']
      password = request.form['password']
      print(name)
      if len(password) < 8:
        return "Password too short, PLease enter a password with atleast 8 Characters"
      hashed_password=generate_password_hash(password)
      conn = sqlite3.connect("ticketapp.db")
      cur = conn.cursor()
      query = """INSERT INTO users (name,username,password) VALUES (?,?,?)"""
      cur.execute(query, (name, username, hashed_password))
      conn.commit()

      if cur.rowcount == 1:
        return "Registered successfully <a href='/login'>Go to Login</a>"
      else:
        return "Username already exists <a href='/register'>Try Register again</a>"
    except:
      return "Something wrong"

  return render_template('register.html')




@app.route('/feed',methods=["GET"])
@jwt_required()
def feed():
  return render_template("feed.html")


@app.route('/admindashboard',methods=["GET"])
@jwt_required()
def admindashboard():
  return render_template("admindashboard.html")


@app.route("/")
def home():
  return render_template("index.html")


@app.route("/createshow", methods=["GET","POST"])
def createshow():
  args = request.args
  name = args.get('name')
  place=args.get('place')
  data = request.get_json()
  # username = session['username']
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """INSERT into show (theater,place,name,rating,tag,price,totalSeat,availableSeat) VALUES(?,?,?,?,?,?,?,?)"""
  cur.execute(query, (name, place,data.get('showName'),data.get('showRating'),data.get('showTag'),data.get('showPrice'),data.get('showTotalSeats'),data.get('showAvailableSeats')))
  conn.commit()
  return jsonify("SUCCESS")


@app.route("/booktickets/<id>", methods=["GET","POST"])
def booktickets(id):
  print(id)
  data = request.get_json()
  name = data.get('name')
  place=data.get('place')
  tickets=int(data.get('tickets'))
  print(name,place,tickets)
  todayDate=date.today() 
  username = session['username']
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """SELECT name,price,availableSeat FROM show
  where id=?"""
  cur.execute(query, (id,))
  for results in cur:
    show=results[0]
    price=int(results[1])
    availableTickets=int(results[2])
  
  if int(tickets) > int(availableTickets):
    return jsonify("Not Enough tickets available!")
  else:
    query="""UPDATE show set availableSeat=? where id=?"""
    cur.execute(query,(int(availableTickets)-int(tickets),id))
    query="""INSERT into ticketsBooked (name,theater,place,show,ticketsBooked,date,price) values (?,?,?,?,?,?,?)"""
    cur.execute(query,(username,name,place,show,tickets,todayDate,price*tickets))
  conn.commit()
  return jsonify("Tickets booked sucessfully")



@app.route("/getallshow", methods=["GET"])
def getallshow():
  args = request.args
  name = args.get('name')
  place=args.get('place')
  # username = session['username']
  # print(username)
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """Select * from show where theater=? and place=?"""
  cur.execute(query, (name,place ))
  data = []
  for row in cur:
    data.append({'id': row[0], 'showName': row[3], 'showRating': row[4],'showTag':row[5],'showPrice':row[6],'TotalSeats':row[7],'availableSeat':row[8]})
  print("data:", data)
  return jsonify(data)



@app.route("/getalltheater")
def getalltheater():
  # username = session['username']
  # print(username)
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """Select * from theatre"""
  cur.execute(query)

  data = []
  for row in cur:
    data.append({'id': row[0], 'theaterName': row[1], 'theaterPlace': row[2]})
  print("data:", data)
  return jsonify(data)

@app.route("/getSummary")
def getsummary():
  # username = session['username']
  # print(username)
  todayDate=date.today()
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """Select theater,sum(ticketsBooked) as totalTickets,sum(price) as totalRevenue from ticketsBooked where date=? group by theater"""
  cur.execute(query,(todayDate,))

  data = []
  for row in cur:
    data.append({'theaterName': row[0], 'totalTickets': row[1], 'totalRevenue': row[2]})
    
  print("data:", data)
  return jsonify(data)


@app.route("/createtheater", methods=['POST'])
def createtheater():
  data = request.get_json()
  print("theater name:", data.get("theaterName"), "Theater place:",
        data.get("theaterPlace"))
  username = session['username']
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """insert into theatre (name,place) values(?,?)"""
  cur.execute(query, (data.get('theaterName'), data.get("theaterPlace")))
  conn.commit()

  return jsonify("Theater successfully added")


@app.route("/searchLocation", methods=['POST'])
def searchLocation():
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  data = request.get_json()
  searchvalue = data.get("value")
  print("Searching Location:", searchvalue)
  query = """Select name,place from theatre where place=?"""
  cur.execute(query, (searchvalue, ))
  data = []
  for row in cur:
    data.append({'theaterName':row[0],"theaterPlace":row[1]})

  return jsonify(data)

@app.route("/searchTag", methods=['POST'])
def searchTag():
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  data = request.get_json()
  searchvalue = data.get("value")
  print("Searching Location:", searchvalue)
  query = """Select theater,place from show where tag=?"""
  cur.execute(query, (searchvalue, ))
  data = []
  for row in cur:
    data.append({'theaterName':row[0],"theaterPlace":row[1]})

  return jsonify(data)

@app.route("/searchRating", methods=['POST'])
def searchRating():
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  data = request.get_json()
  searchvalue = data.get("value")
  print("Searching Location:", searchvalue)
  query = """Select theater,place from show where rating=?"""
  cur.execute(query, (searchvalue, ))
  data = []
  for row in cur:
    data.append({'theaterName':row[0],"theaterPlace":row[1]})

  return jsonify(data)

@app.route("/update_theater/<id>", methods=['POST'])
def update_theater(id):
  # For form --> request.form['parameter'] --> request.files['file']
  username = session['username']
  data = request.get_json()
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
 

  query = """UPDATE theatre
             SET name=?,place=?
             Where id=?"""
  cur.execute(query, (data.get('theaterName'), data.get("theaterPlace"), id))
  conn.commit()
  return jsonify("Theater successfully updated")

@app.route("/update_show/<id>", methods=['POST'])
def update_show(id):
  # For form --> request.form['parameter'] --> request.files['file']
  username = session['username']
  data = request.get_json()
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
 

  query = """UPDATE show
             SET name=?,rating=?,tag=?,price=?,totalSeat=?,availableSeat=?
             Where id=?"""
  cur.execute(query, (data.get('showName'), data.get("showRating"),data.get("showTag"),data.get("showPrice"),data.get("showTotalSeats"),data.get("showAvailableSeats"), id))
  conn.commit()
  return jsonify("show successfully updated")


@app.route("/deletetheater/<id>")
def delete_theater(id):
  # username = session['username']
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """select name from theatre
            WHERE id=?"""
  cur.execute(query, (id,))
  for row in cur:
    theaterName=row[0]
  query = """Delete from theatre
            WHERE id=?"""
  cur.execute(query, (id,))
  query = """Delete from show
            WHERE theater=?"""
  cur.execute(query, (theaterName,))
  conn.commit()
  return jsonify("Card deleted...")

@app.route("/deleteshow/<id>")
def delete_show(id):
  # username = session['username']
  conn = sqlite3.connect("ticketapp.db")
  cur = conn.cursor()
  query = """Delete from show
            WHERE id=?"""
  cur.execute(query, (id,))
  conn.commit()
  return jsonify("Card deleted...")

@app.route("/trigger-celery-job")
def trigger_celery_job():
    a = generate_csv()
    return "Job Sucessfull!"

@app.route("/download-file")
def download_file():
    return send_file("static/data.csv")
# generate_csv()

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)
