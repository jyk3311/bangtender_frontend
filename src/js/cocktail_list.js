import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    navbar();

    let nextUrl = 'https://api.bangtender.store/api/v1/cocktail/';
    let isLoading = false;
    const addCocktailButton = document.getElementById('add-cocktail-btn');

    // Access Token 포함 여부 확인 및 칵테일 목록 가져오기
    async function fetchCocktails(url) {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { headers: headers });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // is_superuser에 따라 게시물 등록 버튼 처리
            if (data.is_superuser) {
                addCocktailButton.style.display = 'block';
                addCocktailButton.addEventListener('click', () => {
                    window.location.href = '/pages/create_cocktail.html';
                });
            } else {
                addCocktailButton.style.display = 'none';
            }

            return data;
        } catch (error) {
            console.error('Error fetching cocktails:', error);
        }
    }

    // 칵테일 정보를 화면에 표시하는 함수
    function displayCocktails(cocktails) {
        const cocktailList = document.getElementById('cocktail-list');
        cocktails.forEach(cocktail => {
            const cocktailItem = document.createElement('div');
            cocktailItem.className = 'cocktail-item';
            cocktailItem.innerHTML = `
                <img src="${cocktail.img}" alt="${cocktail.name}" class="cocktail-img" data-id="${cocktail.id}">
                <h3>${cocktail.name}</h3>
            `;
            cocktailList.appendChild(cocktailItem);
        });

        // 클릭 시 상세 페이지로 이동하는 이벤트 추가
        document.querySelectorAll('.cocktail-img').forEach(img => {
            img.addEventListener('click', function () {
                const cocktailId = this.getAttribute('data-id');
                window.location.href = `/pages/cocktail_detail.html?id=${cocktailId}`; // 상세 페이지로 이동
            });
        });
    }

    // 더 많은 칵테일 데이터를 로드하는 함수
    async function loadMoreCocktails() {
        if (isLoading || !nextUrl) return;

        isLoading = true;
        document.getElementById('loading').style.display = 'block';

        const data = await fetchCocktails(nextUrl);
        if (data) {
            displayCocktails(data.data.records);
            nextUrl = data.data.next;
            isLoading = false;
            document.getElementById('loading').style.display = 'none';
        }
    }

    // 화면 하단 근처에 도달했는지 체크하는 함수
    function isNearBottom() {
        return window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
    }

    // 스크롤 이벤트 핸들러
    function handleScroll() {
        if (isNearBottom()) {
            loadMoreCocktails();
        }
    }

    // 초기 칵테일 데이터를 로드
    loadMoreCocktails();

    // 스크롤 이벤트 추가
    window.addEventListener('scroll', handleScroll);
});
