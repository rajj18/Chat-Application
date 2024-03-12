// Connect to the WebSocket server
const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const typing = document.querySelector('#typing').innerHTML

// Extract username and room from URL
const obj = new URLSearchParams(location.search)
const {username, room} = Object.fromEntries(obj)

// Function to automatically scroll messages to the bottom
const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Calculate height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height of message container
    const visibleHeight = $messages.offsetHeight

    // Total height of message container
    const containerHeight = $messages.scrollHeight

    // How far has the user scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    // Scroll to bottom if user is at the bottom before new message is added
    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Event listener for receiving normal messages
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Event listener for receiving typing indication
socket.on('istyping', (message) => {
    console.log(message)
    const html = Mustache.render(typing, {
        message: `${user} is typing`
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// Event listener for receiving location messages
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Event listener for receiving room data
socket.on('roomData', ({ room, users, count }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
        count
    })
    document.querySelector('#sidebar').innerHTML = html
})

// Event listener for submitting a message
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    // Emit message to server
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

// Event listener for sharing location
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    // Get current position and emit location to server
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})

// Join the chat room upon page load
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/' // Redirect to homepage if there's an error
    }
})
