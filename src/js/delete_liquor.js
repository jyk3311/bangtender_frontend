import { navbar } from './navbar.js';
import config from './config.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const liquorId = urlParams.get('id');
    const confirmDeleteButton = document.getElementById('confirm-delete-btn');

    // 삭제 버튼 클릭 시 삭제 요청
    confirmDeleteButton.addEventListener('click', async function () {
        const confirmDelete = confirm('정말로 이 주류를 삭제하시겠습니까?');

        if (confirmDelete) {
            try {
                const response = await fetch(`https://${config.backendApiUrl}/api/v1/liquor/${liquorId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    },
                });

                const result = await response.json();

                if (response.status === 200) {
                    // 삭제 성공 시
                    alert('주류가 성공적으로 삭제되었습니다.');
                    window.location.href = '../pages/liquor_list.html'; // 삭제 후 리스트 페이지로 이동
                } else if (response.status === 403) {
                    // 관리자가 아닌 경우
                    alert('접근 불가 / 관리자만 가능합니다.');
                } else {
                    // 기타 오류 처리
                    alert('오류 발생: ' + result.detail);
                }
            } catch (error) {
                console.error('요청 실패:', error);
                alert('삭제 요청에 실패했습니다.');
            }
        }
    });
});
