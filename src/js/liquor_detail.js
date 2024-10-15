import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async function () {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const liquorId = urlParams.get('id');
    const bookmarkButton = document.getElementById('bookmark-button');

    try {
        const response = await fetch(`http://43.203.219.114/api/v1/liquor/${liquorId}/`);
        if (!response.ok) {
            throw new Error('주류 정보를 불러오지 못했습니다.');
        }
        const liquor = await response.json();
        const mediaUrl = `http://43.203.219.114${liquor.img}`;

        // 주류 정보를 페이지에 표시
        document.getElementById('liquor-name').textContent = liquor.name;
        document.getElementById('liquor-img').src = mediaUrl;
        document.getElementById('liquor-classification').textContent = liquor.classification;
        document.getElementById('liquor-content').textContent = liquor.content;
        document.getElementById('liquor-taste').textContent = liquor.taste;
        document.getElementById('liquor-abv').textContent = `${liquor.abv}%`;
        document.getElementById('liquor-price').textContent = `${liquor.price} 원`;

        if (liquor.is_bookmarked) {
            bookmarkButton.textContent = '북마크 취소';
        } else {
            bookmarkButton.textContent = '북마크';
        }

        // 북마크 버튼 클릭 이벤트 처리
        bookmarkButton.addEventListener('click', async () => {
            try {
                const bookmarkResponse = await fetch(`http://43.203.219.114/api/v1/liquor/${liquorId}/bookmark/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                const result = await bookmarkResponse.json();

                // 결과에 따라 버튼 텍스트 변경 및 메시지 출력
                if (bookmarkResponse.ok) {
                    if (bookmarkButton.textContent === '북마크') {
                        bookmarkButton.textContent = '북마크 취소';
                    } else {
                        bookmarkButton.textContent = '북마크';
                    }
                    alert(result.message);
                } else {
                    alert(result.detail || '북마크 요청 중 오류가 발생했습니다.');
                }

            } catch (error) {
                console.error('Bookmark request failed:', error);
            }
        });

    } catch (error) {
        console.error('주류 정보 로드 중 오류 발생:', error);
    }
});
