import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    navbar();
});

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
let messageHistory = [];  // 이전 대화 기록 저장

// 메시지 스트리밍처럼 출력하는 함수
function streamMessage(message, role, messageDiv) {
    let index = 0;
    const intervalId = setInterval(() => {
        if (index < message.length) {
            messageDiv.textContent = message.substring(0, index + 1); // 한 글자씩 블록 안에 추가
            index++;
        } else {
            clearInterval(intervalId); // 모든 글자가 출력되면 멈춤
        }
    }, 10); // 50ms 간격으로 한 글자씩 출력
}

// 백엔드로 메시지를 전송하고 응답을 받는 함수
function sendMessageToBot(message) {
    const token = localStorage.getItem('access_token');  // 인증 토큰을 가져옴

    fetch('https://api.bangtender.store/api/v1/subcontents/bangtenderbot/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            message: message,
            history: messageHistory
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const lastMessage = data[data.length - 1];
            let botReply = lastMessage.content || lastMessage.message || JSON.stringify(lastMessage);
            addMessageToChat('assistant', botReply)
            messageHistory = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function addMessageToChat(role, content) {
    console.log('Adding message to chat:', role, content);
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(role === 'user' ? 'user-message' : 'bot-message');

    if (role === 'assistant') {
        const botIcon = document.createElement('div');
        botIcon.classList.add('bot-icon');
        messageDiv.prepend(botIcon);  // 봇 아이콘 추가
    }
    chatMessages.appendChild(messageDiv);


    // 메시지를 한 블록 안에서 스트리밍처럼 출력
    streamMessage(content, role, messageDiv);

    const chatArea = document.querySelector('.chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;
}

// 버튼 클릭 시 이벤트 처리
sendButton.addEventListener('click', function () {
    const message = userInput.value;

    if (message.trim() !== "") {
        addMessageToChat('user', message);  // 사용자 메시지 추가
        userInput.value = '';  // 입력 필드 비우기

        sendMessageToBot(message);  // 메시지를 서버로 전송
    }
});

// Enter 키로도 메시지 전송 가능하게 설정
userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});