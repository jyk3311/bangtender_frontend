import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    navbar();

    try {
        const response = await fetch('http://localhost:8000/api/v1/subcontents/');
        if (!response.ok) {
            throw new Error('데이터를 불러오지 못했습니다.');
        }

        const data = await response.json();

        // Tip 정보 표시
        document.getElementById('tip-content').textContent = `Tips: ${data.info.content}`;

        // 추천 칵테일 표시
        const recommendedCocktails = data.cocktail_list;
        const recommendedContainer = document.getElementById('recommended-cocktails');
        recommendedContainer.innerHTML = '';

        recommendedCocktails.forEach(cocktail => {
            const cocktailItem = document.createElement('div');
            cocktailItem.classList.add('cocktail-item');
            const imgElement = document.createElement('img');
            imgElement.src = `http://localhost:8000${cocktail.img}`;
            imgElement.alt = cocktail.name;
            cocktailItem.appendChild(imgElement);
            recommendedContainer.appendChild(cocktailItem);
        });

        // 사용자 맞춤 칵테일 표시
        if (data.user_liquor_list && typeof data.user_liquor_list !== 'string') {
            const personalizedCocktails = data.user_liquor_list;
            const personalizedContainer = document.getElementById('personalized-cocktails');
            personalizedContainer.innerHTML = '';

            personalizedCocktails.forEach(cocktail => {
                const cocktailItem = document.createElement('div');
                cocktailItem.classList.add('cocktail-item');
                const imgElement = document.createElement('img');
                imgElement.src = `http://localhost:8000${cocktail.img}`;
                imgElement.alt = cocktail.name;
                cocktailItem.appendChild(imgElement);
                personalizedContainer.appendChild(cocktailItem);
            });
        } else {
            // 사용자 맞춤 데이터가 없을 때 메시지 출력
            const personalizedContainer = document.getElementById('personalized-cocktails');
            personalizedContainer.innerHTML = '<p>사용자 데이터가 등록되지 않았습니다.</p>';
        }

    } catch (error) {
        console.error('Error fetching main page data:', error);
    }
});
