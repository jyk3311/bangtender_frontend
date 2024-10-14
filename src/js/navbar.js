import { logoutUser } from './logout.js';
import { searchBar } from './search_bar.js';

// 유저 인증 상태 확인 및 설정 함수
export function navbar() {
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
        }
    } else {
        // 유저가 인증되지 않은 경우
        authLink.href = 'pages/login.html';  // 로그인 페이지로 링크
        authButton.textContent = '로그인';
        logoutButton.style.display = 'none';  // 로그아웃 버튼 숨기기
    }

    // 주류 카테고리 클릭 이벤트 처리
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();  // 기본 동작 방지
            const classification = this.dataset.classification;  // data-classification 값을 가져옴
            window.location.href = `pages/liquor_list.html?classification=${classification}`;  // 해당 분류에 맞는 주류 페이지로 이동
        });
    });

    // 검색
    searchBar();
}
