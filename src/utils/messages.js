// Function to generate a message object with username, text, and timestamp
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime() // Timestamp when the message was created
    }
}

// Function to generate a location message object with username, URL, and timestamp
const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime() // Timestamp when the location message was created
    }
}

// Export the functions to make them accessible to other modules
module.exports = {
    generateMessage,
    generateLocationMessage
}
