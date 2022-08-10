const socket = io();
const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

let roomName;

function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit('new_message', input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}
function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector('form');
    form.addEventListener('submit', handleMessageSubmit);
}
function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    socket.emit('enter_room', input.value, showRoom);
    roomName = input.value;
    // Websocket은 String만 전송할수있어서 타입을 바꿔줘야 했는데, socketio는 Object를 보낼 수 있어서 타입변환이 필요없다
    input.value = '';
}
form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', () => {
    addMessage('someone joined!');
});
socket.on('bye', () => {
    addMessage('someone left ㅠㅠ!');
});
socket.on('new_message', addMessage);
