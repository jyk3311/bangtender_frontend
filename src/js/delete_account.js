import { logoutUser } from './logout.js';
import { navbar } from './navbar.js';
import config from './config.js';

document.addEventListener("DOMContentLoaded", function () {
    navbar();

    const deleteAccountButton = document.getElementById('delete-account-btn');

    deleteAccountButton.addEventListener('click', function () {
        const confirmation = confirm("정말 회원탈퇴를 진행하시겠습니까?");

        if (confirmation) {
            const password = document.getElementById('password').value;
            const token = localStorage.getItem('access_token');

            if (!password) {
                alert("비밀번호를 입력해주세요.");
                return;
            }

            const url = `${config.backendApiUrl}/api/v1/accounts/`;
            const requestData = {
                password: password
            };

            fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "회원탈퇴에 성공했습니다.") {
                        alert("회원탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
                        // 회원탈퇴 성공 시 로그아웃 처리
                        logoutUser();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    alert("회원탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
                });
        }
    });
});
