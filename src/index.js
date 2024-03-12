const path = require('path')
//import path from 'path'
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // Event listener for when a user joins a chat room
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        const numOfUsers = getUsersInRoom(user.room).length
        // Emit a welcome message to the user who joined
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        // Broadcast to everyone in the room that a new user has joined
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        // Emit room data to update sidebar with active users
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
            count: numOfUsers
        })

        callback()
    })

    // Event listener for when a user is typing
    socket.on('typing', (message) => {
        const user = getUser(socket.id)
        if(message.length()>1){
            socket.broadcast.to(user.room).emit('isTyping', `${user} is typing...`)
        }
    })

    // Event listener for when a user sends a message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        if(user){
            // Emit message to the user who sent it
            socket.emit('message', generateMessage("You", message))
        }

        // Broadcast message to everyone in the room except the sender
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    // Event listener for when a user sends their location
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if(user){
            // Emit location message to the user who sent it
            socket.emit('locationMessage', generateLocationMessage("You", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        }
        // Broadcast location message to everyone in the room except the sender
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    // Event listener for when a user disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            // Broadcast message to everyone in the room that a user has left
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            // Update room data to remove the user from the sidebar
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

// Start the server
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
