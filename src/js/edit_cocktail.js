import { navbar } from './navbar.js';
import config from './config.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const cocktailId = urlParams.get('id'); // URL에서 pk 가져오기

    // 폼 데이터 가져오기
    const form = document.getElementById('post-edit-form');

    // 칵테일 정보 불러오기
    try {
        const response = await fetch(`https://${config.backendApiUrl}/api/v1/cocktail/${cocktailId}/`);
        if (!response.ok) {
            throw new Error('데이터를 불러오지 못했습니다.');
        }
        const cocktail = await response.json();

        // 기존 칵테일 데이터를 폼에 채우기
        document.getElementById('name').value = cocktail.name;
        document.getElementById('ingredients').value = cocktail.ingredients;
        document.getElementById('content').value = cocktail.content;
        document.getElementById('taste').value = cocktail.taste;
        document.getElementById('abv').value = cocktail.abv;
    } catch (error) {
        console.error('error:', error);
    }

    // 폼 제출 시 수정 요청 보내기
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(`https://api.bangtender.store/api/v1/cocktail/${cocktailId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                },
                body: formData
            });

            const data = await response.json();

            if (response.status === 200) {
                // 수정 성공 시
                alert('게시글이 성공적으로 수정되었습니다.');
                window.location.href = `../pages/cocktail_detail.html?id=${cocktailId}`; // 수정 후 상세 페이지로 이동
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
});
