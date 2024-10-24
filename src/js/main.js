import { navbar } from './navbar.js';
import config from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    navbar();

    const token = localStorage.getItem('access_token');

    try {
        // 헤더에 토큰이 있으면 추가
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${config.backendApiUrl}/api/v1/subcontents/`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('데이터를 불러오지 못했습니다.');
        }

        const data = await response.json();

        // Tip 정보 표시
        document.getElementById('tip-content').textContent = `${data.info.content}`;

        // 추천 칵테일 표시
        const recommendedCocktails = data.cocktail_list;
        const recommendedContainer = document.getElementById('recommended-cocktails');
        recommendedContainer.innerHTML = '';

        recommendedCocktails.forEach(cocktail => {
            const cocktailItem = document.createElement('div');
            cocktailItem.classList.add('cocktail-item');
            const imgElement = document.createElement('img');
            imgElement.src = `${cocktail.img}`;
            imgElement.alt = cocktail.name;
            imgElement.addEventListener('click', () => {
                window.location.href = `pages/cocktail_detail.html?id=${cocktail.id}`;  // 상세 페이지로 이동
            });
            cocktailItem.appendChild(imgElement);
            recommendedContainer.appendChild(cocktailItem);
        });

        // 사용자 맞춤 주류 표시 
        if (token && data.user_liquor_list && typeof data.user_liquor_list !== 'string') {
            const userLiquors = data.user_liquor_list;
            const userContainer = document.getElementById('user-liquors');
            userContainer.innerHTML = '';

            userLiquors.forEach(liquor => {
                const liquorItem = document.createElement('div');
                liquorItem.classList.add('cocktail-item');
                const imgElement = document.createElement('img');
                imgElement.src = `${liquor.img}`;
                imgElement.alt = liquor.name;
                imgElement.addEventListener('click', () => {
                    window.location.href = `pages/cocktail_detail.html?id=${liquor.id}`;  // 상세 페이지로 이동
                });
                liquorItem.appendChild(imgElement);
                userContainer.appendChild(liquorItem);
            });
        } else if (token && (!data.user_liquor_list || typeof data.user_liquor_list === 'string')) {
            // 로그인했지만 맞춤 데이터가 없을 때
            const userContainer = document.getElementById('user-liquors');
            userContainer.innerHTML = '<p>사용자 맞춤 칵테일은 사용자가 보유한 술, 좋아하는 술을 기반으로 추천해주고 싫어하는 술은 제외시켜 줍니다.<br/> 칵테일 추천이 뜨지 않는다면 회원 정보 수정에 들어가서 나의 술 목록을 수정해보세요!</p>';
        } else {
            // 로그인하지 않은 경우
            const userContainer = document.getElementById('user-liquors');
            userContainer.innerHTML = '<p>로그인을 하셔야 볼 수 있어요!</p>';
        }

    } catch (error) {
        console.error('message:', error);
    }
});
