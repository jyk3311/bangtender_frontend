import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    navbar();

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');

    if (!searchQuery) {
        alert("검색어가 없습니다.");
        return;
    }

    try {
        const response = await fetch(`https://api.bangtender.store/api/v1/subcontents/search/?message=${searchQuery}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('검색 요청 실패');
        }

        const data = await response.json();

        const liquorListElement = document.getElementById('liquor-list');
        const cocktailListElement = document.getElementById('cocktail-list');

        liquorListElement.innerHTML = '';
        cocktailListElement.innerHTML = '';

        // 주류 검색 결과 렌더링
        if (data.liquor_list.length > 0) {
            data.liquor_list.forEach(liquor => {
                const listItem = createListItem(liquor, 'liquor_detail.html');
                liquorListElement.appendChild(listItem);
            });
        } else {
            liquorListElement.innerHTML = '<li>검색된 주류가 없습니다.</li>';
        }

        // 칵테일 검색 결과 렌더링
        if (data.cocktail_list.length > 0) {
            data.cocktail_list.forEach(cocktail => {
                const listItem = createListItem(cocktail, 'cocktail_detail.html');
                cocktailListElement.appendChild(listItem);
            });
        } else {
            cocktailListElement.innerHTML = '<li>검색된 칵테일이 없습니다.</li>';
        }

    } catch (error) {
        console.error('Error fetching search results:', error);
        alert('검색 중 오류가 발생했습니다.');
    }
});

// 리스트 항목 생성 함수
function createListItem(item, detailPage) {
    const listItem = document.createElement('li');
    listItem.classList.add('result-item');

    const imgElement = document.createElement('img');
    imgElement.src = item.img;
    imgElement.alt = item.name;

    const nameElement = document.createElement('p');
    nameElement.textContent = item.name;

    // 클릭 시 상세 페이지로 이동
    listItem.addEventListener('click', () => {
        window.location.href = `${detailPage}?id=${item.id}`;
    });

    listItem.appendChild(imgElement);
    listItem.appendChild(nameElement);

    return listItem;
}
