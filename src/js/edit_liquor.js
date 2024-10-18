import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const liquorId = urlParams.get('id'); // URL에서 pk 가져오기

    // 폼 데이터 가져오기
    const form = document.getElementById('post-edit-form');

    // 주류 정보 불러오기
    try {
        const response = await fetch(`https://api.bangtender.store/api/v1/liquor/${liquorId}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch liquor details');
        }
        const liquor = await response.json();

        // 기존 주류 데이터를 폼에 채우기
        document.getElementById('name').value = liquor.name;
        document.getElementById('classification').value = liquor.classification;
        document.getElementById('content').value = liquor.content;
        document.getElementById('taste').value = liquor.taste;
        document.getElementById('abv').value = liquor.abv;
        document.getElementById('price').value = liquor.price;
    } catch (error) {
        console.error('Error fetching liquor details:', error);
    }

    // 폼 제출 시 수정 요청 보내기
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(`https://api.bangtender.store/api/v1/liquor/${liquorId}/`, {
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
                window.location.href = `../pages/liquor_detail.html?id=${liquorId}`; // 수정 후 상세 페이지로 이동
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
