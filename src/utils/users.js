// Array to store user data
const users = []

// Function to add a user to the users array
const addUser = ({ id, username, room }) => {
    // Clean the data by trimming and converting to lowercase
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!' // Return error if username or room is missing
        }
    }

    // Check for existing user in the same room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username uniqueness
    if (existingUser) {
        return {
            error: 'Username is in use!' // Return error if username is already taken in the room
        }
    }

    // Store the user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Function to remove a user from the users array
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0] // Remove and return the user object
    }
}

// Function to get a user by their socket ID
const getUser = (id) => {
    return users.find((user) => user.id === id) // Find and return the user with the specified ID
}

// Function to get all users in a specified room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room) // Filter and return users in the specified room
}

// Export the functions to make them accessible to other modules
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
