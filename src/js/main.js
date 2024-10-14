import { navbar } from './navbar.js';

<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {
    const authLink = document.getElementById('auth-link');
    const authButton = document.getElementById('auth-button');
    const logoutButton = document.getElementById('logout-button');

    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            // 유저가 인증된 경우
            authLink.href = `pages/profile.html`;  // 프로필 페이지로 이동
            authButton.textContent = '내 프로필';
            logoutButton.style.display = 'inline';  // 로그아웃 버튼 보이기

            // 로그아웃 버튼 클릭 시 이벤트
            logoutButton.addEventListener('click', function () {
                logoutUser(token);
            });
        } catch (error) {
            console.error('토큰 디코딩 중 오류가 발생했습니다:', error);
            localStorage.removeItem('access_token');  // 오류가 있을 경우 토큰 삭제
=======
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
>>>>>>> dev
        }

        const response = await fetch('http://localhost:8000/api/v1/subcontents/', {
            method: 'GET',
            headers: headers,
        });

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
                imgElement.src = `http://localhost:8000${liquor.img}`;
                imgElement.alt = liquor.name;
                imgElement.addEventListener('click', () => {
                    window.location.href = `pages/liquor_detail.html?id=${liquor.id}`;  // 상세 페이지로 이동
                });
                liquorItem.appendChild(imgElement);
                userContainer.appendChild(liquorItem);
            });
        } else if (token && (!data.user_liquor_list || typeof data.user_liquor_list === 'string')) {
            // 로그인했지만 맞춤 데이터가 없을 때
            const userContainer = document.getElementById('user-liquors');
            userContainer.innerHTML = '<p>사용자 데이터가 등록되지 않았습니다.</p>';
        } else {
            // 로그인하지 않은 경우
            const userContainer = document.getElementById('user-liquors');
            userContainer.innerHTML = '<p>로그인을 하셔야 볼 수 있어요!</p>';
        }

    } catch (error) {
        console.error('message:', error);
    }
});
