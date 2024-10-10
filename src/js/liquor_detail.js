document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const liquorId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8000/api/v1/liquor/${liquorId}/`);
        if (!response.ok) {
            throw new Error('주류 정보를 불러오지 못했습니다.');
        }
        const liquor = await response.json();
        const mediaUrl = `http://localhost:8000${liquor.img}`;

        // 주류 정보를 페이지에 표시
        document.getElementById('liquor-name').textContent = liquor.name;
        document.getElementById('liquor-img').src = mediaUrl;
        document.getElementById('liquor-classification').textContent = liquor.classification;
        document.getElementById('liquor-content').textContent = liquor.content;
        document.getElementById('liquor-taste').textContent = liquor.taste;
        document.getElementById('liquor-abv').textContent = `${liquor.abv}%`;
        document.getElementById('liquor-price').textContent = `${liquor.price} 원`;

    } catch (error) {
        console.error('error message:', error);
    }
});
