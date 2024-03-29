# Socket.IO Chat App

## Description
This is a simple chat application built using Socket.IO, allowing users to join chat rooms and exchange messages in real-time.

## Features

* Real-Time Communication: Users can send and receive messages instantly without refreshing the page.

* Multiple Rooms: Users can join different chat rooms and have separate conversations in each room.

* Display Name Support: Users can choose their nickname, which is displayed alongside their messages.

* Responsive Design: The app is responsive and works well on various devices and screen sizes.


# Setup
## Requirements

* Node.js installed on your system

## Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/rajj18/Chat-Application.git
```

2.Navigate to the project directory:


```bash
cd Chat-Application
```

3. Install the dependencies using npm:

```bash
 npm install
```
4. Start the server:

Copy code
```bash
npm start
```

5. Dependencies:

* Path  - To handle file paths in the application.
```bash
    npm i path
```
* Bad-words  - To handle profanity
```bash
    npm i bad-words
```
* Express -  Web framework for Node.js
```bash
    npm i express
```
* HTTP -  For making http requests
```bash
    npm i http
```
* Socket.io - Real time communication between client and server
```bash
    npm i socket.io
```

Open your web browser and navigate to http://localhost:3000 to access the chat application.

### Usage:

1. Join a Room: Enter a room name and your nickname, then click the "Join Room" button to join a chat room.
2. Send Messages: Type your message in the input field at the bottom of the chat window and press Enter or click the "Send" button to send your message to the room.
3. Send Location: You can send your location by clicking the "Send Location" button. The app will use langitude and longitude co-ordinates from google maps.
4. Leave a Room: Click the "Leave Chat" button to leave the current chat room and return to the room selection screen.
5. Active Users: On the left panel of chat window users can view name and number of active users in that particular room.

## Development
### Technologies Used

* Socket.IO: Enables real-time, bidirectional communication between clients and the server.
* Express.js: Provides a web server framework for Node.js, simplifying the development of   web applications.
* HTML/CSS: Used for the structure and styling of the chat application.
* JavaScript: Used for client-side scripting and handling interactions.

### File Structure

* index.js: The main server file that initializes Socket.IO and handles client connections.
* public/: Contains the client-side HTML, CSS, and JavaScript files.
* src/:  Contains the source code for the server logic.
    * utils/users.js: Contains logic to add, remove, get users.
    * utils/messages.js: Contains logic to generate messages and location.

### Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
