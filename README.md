# How to run application/Setup

# SETUP
For this challenge, I utlized MongoDB for my database. You will need that in order for this to work.
You will also need to add a .env file in your backend folder with proper information.

`DB_URI` set this to your MongoDB connection string <br> <br>
`PORT` you can set this to anything, mine was set to 4000 <br> <br>
`JW_SECRET` (do step 2 before you generate your key) you can generate a key for this by typing `node` -> `require('crypto').randomByes(64).toString('hex')` after installing the necessary packages

1. Terminal One, change directory into the backend folder.
2. `npm instal1` -> `node server.js` to run the backend
3. Terminal Two, make sure you are in the tersano folder
4. `npm install` -> `npm start` to run the application
   
# VIDEO DEMO
https://drive.google.com/file/d/1IpIBtj6QXeoV-lAy2iQjDHnnPF_x7wa3/view?usp=sharing

