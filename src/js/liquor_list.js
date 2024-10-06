let nextUrl = 'http://localhost:8000/api/v1/liquor/';
let isLoading = false;

// API에서 주류 정보를 가져오는 함수
async function fetchLiquors(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching liquors:', error);
    }
}

// 주류 정보를 화면에 표시하는 함수
function displayLiquors(liquors) {
    const liquorList = document.getElementById('liquor-list');
    liquors.forEach(liquor => {
        const liquorItem = document.createElement('div');
        liquorItem.className = 'liquor-item';
        liquorItem.innerHTML = `
            <img src="${liquor.img}" alt="${liquor.name}">
            <h3>${liquor.name}</h3>
            <p>Price: ${liquor.price} 원</p>
        `;
        liquorList.appendChild(liquorItem);
    });
}

// 더 많은 주류 데이터를 로드하는 함수
async function loadMoreLiquors() {
    if (isLoading || !nextUrl) return;

    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    const data = await fetchLiquors(nextUrl);
    if (data) {
        displayLiquors(data.data.records);
        nextUrl = data.data.next; // 다음 페이지 URL 업데이트
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
        loadMoreLiquors();
    }
}

// 초기 주류 데이터를 로드
loadMoreLiquors();

// 스크롤 이벤트 추가
window.addEventListener('scroll', handleScroll);
