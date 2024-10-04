document.addEventListener('DOMContentLoaded', async function () {
    const liquorListDiv = document.getElementById('liquor-list');

    // API 요청을 보내 주류 목록을 가져옴
    try {
        const response = await fetch('http://localhost:8000/api/v1/liquor/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const liquors = await response.json();

            // 주류 목록을 HTML로 변환하여 페이지에 추가
            liquors.forEach((liquor) => {
                const liquorItem = document.createElement('div');
                liquorItem.classList.add('liquor-item');

                liquorItem.innerHTML = `
                    <img src="http://localhost:8000${liquor.img}" alt="${liquor.name}">
                    <h3>${liquor.name}</h3>
                    <p>가격: ${liquor.price}원</p>
                `;

                liquorListDiv.appendChild(liquorItem);
            });
        } else {
            console.error('주류 목록을 가져오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('API 요청 중 오류가 발생했습니다:', error);
    }
});