export function initializeSearchBar() {
    const searchBar = document.querySelector('.search-bar input[type="search"]');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', () => {
        const searchQuery = searchBar.value.trim(); // 검색어 가져오기

        if (!searchQuery) {
            alert("검색어를 입력하세요.");
            return;
        }

        // 검색어를 쿼리 파라미터로 전달하여 검색 결과 페이지로 이동
        window.location.href = `pages/search.html?query=${encodeURIComponent(searchQuery)}`;
    });
}
