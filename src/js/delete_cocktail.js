import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const cocktailId = urlParams.get('id');
    const confirmDeleteButton = document.getElementById('confirm-delete-btn');

    // 삭제 버튼 클릭 시 삭제 요청
    confirmDeleteButton.addEventListener('click', async function () {
        const confirmDelete = confirm('정말로 이 칵테일을 삭제하시겠습니까?');

        if (confirmDelete) {
            try {
                const response = await fetch(`http://3.37.67.87/api/v1/cocktail/${cocktailId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    },
                });

                const result = await response.json();

                if (response.status === 200) {
                    // 삭제 성공 시
                    alert('칵테일이 성공적으로 삭제되었습니다.');
                    window.location.href = '../pages/cocktail_list.html';
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
