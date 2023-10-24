# # # -*- coding: utf-8 -*-
import sqlite3
from datetime import date
conn = sqlite3.connect("ticketapp.db", timeout=10)
cur = conn.cursor()

# query1="""CREATE TABLE users (
#      id INTEGER PRIMARY KEY AUTOINCREMENT,
#      name TEXT,
#      username TEXT NOT NULL UNIQUE,
#      password TEXT NOT NULL
#  )"""
# cur.execute(query1)

# query2="""CREATE TABLE admin (
#      id INTEGER PRIMARY KEY AUTOINCREMENT,
#      username TEXT NOT NULL UNIQUE,
#      password TEXT NOT NULL
#  )"""
# cur.execute(query2)

# query3="""CREATE TABLE theatre (
#      id INTEGER PRIMARY KEY AUTOINCREMENT,
#      name TEXT,
#      place TEXT NOT NULL UNIQUE
     
#  )"""
# cur.execute(query3)

# query4="""CREATE TABLE show (
#      id INTEGER PRIMARY KEY AUTOINCREMENT,
#      theater TEXT,
#      place TEXT,
#      name TEXT,
#      rating INTEGER,
#      tag TEXT,
#      price INTEGER,
#      totalSeat INTEGER,
#      availableSeat INTEGER 
#  )"""
# cur.execute(query4)


# query5="""CREATE table ticketsBooked (
# id INTEGER PRIMARY KEY AUTOINCREMENT,
# name  TEXT NOT NULL,
# theater TEXT,
# place TEXT,
# show TEXT,
# ticketsBooked INTEGER,
# date DATE,
# price INTEGER)"""
# cur.execute(query5)



# query = """INSERT INTO admin (username,password) VALUES (?,?)"""
# cur.execute(query, ( "admin", "admin"))
# conn.commit()

todayDate=date.today()
# query = """Select theater,sum(ticketsBooked) as totalTickets,sum(price) as totalRevenue from ticketsBooked where date=? group by theater"""
# cur.execute(query,(todayDate,))
query="""SELECT * from ticketsBooked"""
cur.execute(query)

data = []
for row in cur:
  # data.append({'theaterName': row[0], 'totalTickets': row[1], 'totalRevenue': row[2]})
  print(row)
# print("data:", data)