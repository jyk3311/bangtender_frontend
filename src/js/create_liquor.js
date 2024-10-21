import { navbar } from './navbar.js';
import config from './config.js';

document.getElementById('post-form').addEventListener('submit', async (event) => {
    navbar();
    event.preventDefault();

    const form = document.getElementById('post-form');
    const formData = new FormData(form);

    try {
        const response = await fetch(`https://${config.backendApiUrl}/api/v1/liquor/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: formData
        });

        const data = await response.json();

        if (response.status === 201) {
            // 성공적으로 등록되었을 때
            alert('게시글이 성공적으로 등록되었습니다.');
            window.location.href = '../pages/liquor_list.html';
        } else if (response.status === 403) {
            // 관리자가 아닌 경우
            alert('접근 불가 / 관리자만 가능합니다.');
        } else if (response.status === 400) {
            // 검증 실패
            alert('검증 오류: ' + data.message);
        } else {
            // 기타 오류
            alert('오류 발생: ' + data.detail);
        }
    } catch (error) {
        console.error('요청 실패:', error);
    }
});
