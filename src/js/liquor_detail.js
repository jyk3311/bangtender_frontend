document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const liquorId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:8000/api/v1/liquor/${liquorId}/`);
        if (!response.ok) {
            throw new Error('Failed to load liquor details');
        }
        const liquor = await response.json();
        const mediaUrl = `http://localhost:8000${liquor.img}`;

        // 주류 정보를 페이지에 표시
        document.getElementById('liquor-name').textContent = liquor.name;
        document.getElementById('liquor-img').src = mediaUrl;
        document.getElementById('liquor-classification').textContent = `분류: ${liquor.classification}`;
        document.getElementById('liquor-content').textContent = `내용: ${liquor.content}`;
        document.getElementById('liquor-taste').textContent = `맛: ${liquor.taste}`;
        document.getElementById('liquor-abv').textContent = `도수: ${liquor.abv}%`;
        document.getElementById('liquor-price').textContent = `가격: ${liquor.price} 원`;

    } catch (error) {
        console.error('Error fetching liquor details:', error);
    }
});
