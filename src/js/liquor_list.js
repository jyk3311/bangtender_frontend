import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    navbar();

    let nextUrl = 'https://api.bangtender.store/api/v1/liquor/';
    let isLoading = false;
    const addLiquorButton = document.getElementById('add-liquor-btn');

    // Access Token 포함 여부 확인 및 주류 목록 가져오기
    async function fetchLiquors(url) {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('access_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, { headers: headers });
            if (!response.ok) {
                throw new Error('서버 상태가 이상합니다.');
            }
            const data = await response.json();

            // is_superuser에 따라 게시물 등록 버튼 처리
            if (data.is_superuser) {
                addLiquorButton.style.display = 'block';
                addLiquorButton.addEventListener('click', () => {
                    window.location.href = '/pages/create_liquor.html';
                });
            } else {
                addLiquorButton.style.display = 'none';
            }

            return data;
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
                window.location.href = `/pages/liquor_detail.html?id=${liquorId}`;
            });
        });
    }

    // 더 많은 주류 데이터를 로드하는 함수
    async function loadMoreLiquors() {
        if (isLoading || !nextUrl) return;
        if (nextUrl.startsWith('http:')) {
            nextUrl = nextUrl.replace('http:', 'https:');
        }
        isLoading = true;
        document.getElementById('loading').style.display = 'block';

        const classification = new URLSearchParams(window.location.search).get('classification');
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

    // 초기 주류 데이터를 로드
    loadMoreLiquors();

    // 스크롤 이벤트 추가
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMoreLiquors();
        }
    });
});
