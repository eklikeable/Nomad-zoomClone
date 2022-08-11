const socket = io();
const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
const currentNickname = document.querySelector('#currentNickname');
const roomName = welcome.querySelector('#roomName');
let roomname;
room.hidden = true;

function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}
function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('new_message', input.value, roomname, () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}
function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector('#name input');
    currentNickname.innerText = `your current nickname is ✨ ${input.value} ✨`;
    socket.emit('nickname', input.value);
    const btn = form.querySelector('#name button');
    btn.textContent = 'change';
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomname}`;
    const msgForm = room.querySelector('#msg');
    msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomName.querySelector('input');
    socket.emit('enter_room', input.value, showRoom);
    // Websocket은 String만 전송할수있어서 타입을 바꿔줘야 했는데, socketio는 Object를 보낼 수 있어서 타입변환이 필요없다
    roomname = input.value;
    input.value = '';
}

roomName.addEventListener('submit', handleRoomSubmit);
const nameForm = welcome.querySelector('#name');
nameForm.addEventListener('submit', handleNicknameSubmit);

socket.on('welcome', (user, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomname} (${newCount})`;
    addMessage(`${user} arrived!`);
});
socket.on('bye', (user, newCount) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomname} (${newCount})`;
    addMessage(`${user} left ㅠㅠ!`);
});
socket.on('new_message', addMessage);
socket.on('room_change', (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML = '';
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});
