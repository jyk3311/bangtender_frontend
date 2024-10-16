import { logoutUser } from './logout.js';
import { searchBar } from './search_bar.js';

// 유저 인증 상태 확인 및 설정 함수
export function navbar() {
    const authLink = document.getElementById('auth-link');
    const authButton = document.getElementById('auth-button');
    const logoutButton = document.getElementById('logout-button');

    const token = localStorage.getItem('access_token');

    // 현재 경로에서 'pages' 폴더가 있는지 확인
    let currentPath = window.location.pathname;
    let profilePagePath = currentPath.includes('/pages/')
        ? 'profile.html'  // 이미 'pages' 폴더 안에 있을 때
        : 'pages/profile.html';  // 'pages' 폴더 밖에서 접근할 때
    let loginPagePath = currentPath.includes('/pages/')
        ? 'login.html'
        : 'pages/login.html';

    if (token) {
        try {
            // 유저가 인증된 경우
            authLink.href = profilePagePath;  // 프로필 페이지로 이동
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
        authLink.href = loginPagePath;  // 로그인 페이지로 링크
        authButton.textContent = '로그인';
        logoutButton.style.display = 'none';  // 로그아웃 버튼 숨기기
    }

    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();  // 기본 동작 방지
            const classification = this.dataset.classification;  // data-classification 값을 가져옴

            // 주류 목록 페이지 경로 설정
            let liquorListPagePath = currentPath.includes('/pages/')
                ? 'liquor_list.html'
                : 'pages/liquor_list.html';

            // 페이지 이동
            window.location.href = `${liquorListPagePath}?classification=${classification}`;
        });
    });

    // 검색
    searchBar();
}
