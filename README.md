# Movie-Ticket-Booking-WebApp

Technologies used 
Python, Flask, Jinja2, Sqlite, HTML, Javascript, Vue.js, redis, celery.

DB Schema Design
Admin columns:
Name
Username
Password
   
Users columns:
id
Name
Username
Password

Theatre columns:
id
Name
Place

Show Columns:
id
Name
Place
Theatre
Rating
Price
   
Architecture and Features
The whole program is kept in a zip file, in it there is a folder called main.py which contains the main program 
code to run the app. Next there is a folder named templates which contains all the templates of the app in 
form of HTML files and then there is a folder projectdb which has all the code required for setting a database.
Whenever a user will run this app the first window opened will be the login window, from there the user can 
login or can register and admin can also login from there itself if not registered before by clicking on the 
register link, after logging in a user’s dashboard will open showing the theatres available and the shows in it. In 
admin’s dashboard the admin can add, delete and update the shows/theatres. Further celery is used from 
which the user can generate a report of the tickets he/she booked.
