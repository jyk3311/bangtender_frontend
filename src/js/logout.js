import config from './config.js';

export function logoutUser() {
    fetch(`${config.backendApiUrl}/api/v1/accounts/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"  // 세션 정보 포함
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // 로그아웃 성공 시 메인 페이지로 이동
                window.location.href = "/";
            } else {
                alert("로그아웃 중 문제가 발생했습니다.");
            }
        })
        .catch(error => {
            alert("로그아웃 요청 중 오류가 발생했습니다.");
        });
}