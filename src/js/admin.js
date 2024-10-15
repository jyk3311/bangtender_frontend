import { navbar } from './navbar.js';

document.addEventListener('DOMContentLoaded', function () {
    navbar();

    // 주류 게시물 관리 버튼 이벤트
    document.getElementById('create-liquor').addEventListener('click', function () {
        window.location.href = 'create_liquor.html';
    });

    document.getElementById('edit-liquor').addEventListener('click', function () {
        window.location.href = 'edit_liquor.html';
    });

    document.getElementById('delete-liquor').addEventListener('click', function () {
        window.location.href = 'delete_liquor.html';
    });

    // 칵테일 게시물 관리 버튼 이벤트
    document.getElementById('create-cocktail').addEventListener('click', function () {
        window.location.href = 'create_cocktail.html';
    });

    document.getElementById('edit-cocktail').addEventListener('click', function () {
        window.location.href = 'edit_cocktail.html';
    });

    document.getElementById('delete-cocktail').addEventListener('click', function () {
        window.location.href = 'delete_cocktail.html';
    });
});
