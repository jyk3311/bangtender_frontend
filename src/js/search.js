document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');

    if (!searchQuery) {
        alert("검색어가 없습니다.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/api/v1/subcontents/search/?message=${searchQuery}`, {
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

        // 주류 검색 결과가 있을 경우 렌더링
        if (data.liquor_list.length > 0) {
            data.liquor_list.forEach(liquor => {
                const listItem = document.createElement('li');
                listItem.textContent = `${liquor.name} - ${liquor.classification}`;
                liquorListElement.appendChild(listItem);
            });
        } else {
            liquorListElement.innerHTML = '<li>검색된 주류가 없습니다.</li>';
        }

        // 칵테일 검색 결과가 있을 경우 렌더링
        if (data.cocktail_list.length > 0) {
            data.cocktail_list.forEach(cocktail => {
                const listItem = document.createElement('li');
                listItem.textContent = cocktail.name;
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
