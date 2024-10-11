document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const cocktailId = urlParams.get('id');
    const bookmarkButton = document.getElementById('bookmark-button');

    try {
        const response = await fetch(`http://localhost:8000/api/v1/cocktail/${cocktailId}/`);
        if (!response.ok) {
            throw new Error('Failed to load cocktail details');
        }
        const cocktail = await response.json();
        const mediaUrl = `http://localhost:8000${cocktail.img}`;

        // 칵테일 정보를 페이지에 표시
        document.getElementById('cocktail-name').textContent = cocktail.name;
        document.getElementById('cocktail-img').src = mediaUrl;
        document.getElementById('cocktail-content').textContent = `설명: ${cocktail.content}`;
        document.getElementById('cocktail-ingredients').textContent = `재료: ${cocktail.ingredients}`;
        document.getElementById('cocktail-taste').textContent = `맛: ${cocktail.taste}`;
        document.getElementById('cocktail-abv').textContent = `도수: ${cocktail.abv}%`;
        document.getElementById('cocktail-created-at').textContent = `생성일: ${new Date(cocktail.created_at).toLocaleDateString()}`;
        document.getElementById('cocktail-updated-at').textContent = `업데이트일: ${new Date(cocktail.updated_at).toLocaleDateString()}`;

        if (cocktail.is_bookmarked) {
            bookmarkButton.textContent = '북마크 취소';
        } else {
            bookmarkButton.textContent = '북마크';
        }

        // 북마크 버튼 클릭 이벤트 처리
        bookmarkButton.addEventListener('click', async () => {
            try {
                const bookmarkResponse = await fetch(`http://localhost:8000/api/v1/cocktail/${cocktailId}/bookmark/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                const result = await bookmarkResponse.json();

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
        console.error('Error fetching cocktail details:', error);
    }
});
