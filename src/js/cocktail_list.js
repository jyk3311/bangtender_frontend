import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', () => {
    navbar();

    let nextUrl = 'http://43.203.219.114/api/v1/cocktail/';
    let isLoading = false;

    // API에서 칵테일 정보를 가져오는 함수
    async function fetchCocktails(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
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
                window.location.href = `/pages/cocktail_detail.html?id=${cocktailId}`;  // 상세 페이지로 이동
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
