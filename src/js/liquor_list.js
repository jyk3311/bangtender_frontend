let nextUrl = 'http://localhost:8000/api/v1/liquor/';
let isLoading = false;

// URL에서 쿼리 파라미터 가져오기 함수
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// API에서 주류 정보를 가져오는 함수
async function fetchLiquors(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('서버 상태가 이상합니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('error:', error);
    }
}

// 주류 정보를 화면에 표시하는 함수
function displayLiquors(liquors) {
    const liquorList = document.getElementById('liquor-list');
    liquors.forEach(liquor => {
        const liquorItem = document.createElement('div');
        liquorItem.className = 'liquor-item';
        liquorItem.innerHTML = `
            <img src="${liquor.img}" alt="${liquor.name}" class="liquor-img" data-id="${liquor.id}">
            <h3>${liquor.name}</h3>
            <p>Price: ${liquor.price} 원</p>
        `;
        liquorList.appendChild(liquorItem);
    });

    // 클릭 시 상세 페이지로 이동하는 이벤트 추가
    document.querySelectorAll('.liquor-img').forEach(img => {
        img.addEventListener('click', function () {
            const liquorId = this.getAttribute('data-id');
            window.location.href = `/pages/liquor_detail.html?id=${liquorId}`;  // 상세 페이지로 이동
        });
    });
}

// 더 많은 주류 데이터를 로드하는 함수 (페이지네이션 적용)
async function loadMoreLiquors() {
    if (isLoading || !nextUrl) return;
    isLoading = true;
    document.getElementById('loading').style.display = 'block';

    const classification = getQueryParam('classification');
    let url = new URL(nextUrl, window.location.origin);

    if (classification) {
        url.searchParams.set('classification', classification);
    }

    try {
        const data = await fetchLiquors(url.toString());
        if (data && data.data) {
            displayLiquors(data.data.records);
            nextUrl = data.data.next;
        }
    } catch (error) {
        console.error('error:', error);
    } finally {
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
