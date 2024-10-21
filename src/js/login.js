import { navbar } from './navbar.js';
import config from './config.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch(`https://${config.backendApiUrl}/api/v1/accounts/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            // 로그인 성공, 액세스 토큰과 리프레시 토큰을 로컬 스토리지에 저장
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            messageDiv.innerHTML = '<p>로그인 되셨습니다.</p>';

            window.location.href = "/"; // 성공시 이동할 페이지
        } else {
            // 오류 메시지 출력
            messageDiv.innerHTML = `<p>${data.message}</p>`;
        }
    });
});
