# Task Manager With MERN Stack

#### This project is an educational project that I have implemented. It is a clone of the popular Trello application with an additional functionality for managing a warehouse.

The aim of the project was to improve my skills in the MERN stack (MongoDB, Express, React, and Node.js) and to use additional tools and libraries such as JWT token, AWS S3, and Redux Toolkit.

During the project, I used JWT token for user authentication, AWS S3 for storing product images, and Redux Toolkit for managing the application state. The application allows adding, browsing, editing, and deleting cards, as well as other basic functionalities found in the Trello application.

## Built With
TypeScript,
React / Redux Toolkit,
MongoDB / Mongoose,
NodeJS, Express,
AWS S3,
JWT token,
Module SCSS

## Demo
👉  https://print-control-m.netlify.app/

## Demo Account Credentials
Login:  `demo@gmail.com`
Password:  `Demo1234` 

## Installation
- Clone the repository from GitHub.
- Install Node.js on your machine if it is not already installed.
- Move into the project directory: cd Trellify
- Install backend dependencies: npm install
- Move into the client directory: cd client
- Install client dependencies: npm install

## Setup
### Backend setup
- Setting up MongoDB
To set up MongoDB, you will need to create a database and a user with read and write access to the database.
- Setting up AWS S3
To set up AWS S3, you will need to create an AWS account and set up a bucket to store images.
- Installing TypeScript
To run the server in TypeScript, you will need to install TypeScript globally. You can do this by running the following command:
npm install -g typescript
- Backend environment variables .env file:
- (```)
PORT: Port number
MONGODB_URI: The URI for your MongoDB database.
JWT_SECRET: The secret key for JWT token generation.
AWS_ACCESS_KEY_ID: The access key ID for your AWS S3 bucket.
AWS_SECRET_ACCESS_KEY: The secret access key for your AWS S3 bucket.
AWS_REGION: The region for your AWS S3 bucket.
AWS_BUCKET_NAME: The name of your AWS S3 bucket.
(```)

### Client setup
- Client environment variables .env file
REACT_APP_API_URL: local host URL

## Running the application
Start the backend: npm start
In a separate terminal window, start the client: npm start
The application should now be running at http://localhost:3000.
