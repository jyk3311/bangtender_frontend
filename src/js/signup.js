document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    const formData = {
        username: username,
        password: password,
        password_confirm: passwordConfirm,
        name: name,
        email: email,
        address: address
    };

    try {
        const response = await fetch('http://localhost:8000/api/v1/accounts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        // 모든 에러 메시지 필드를 초기화
        document.getElementById('username-error').innerHTML = '';
        document.getElementById('password-error').innerHTML = '';
        document.getElementById('password-confirm-error').innerHTML = '';
        document.getElementById('name-error').innerHTML = '';
        document.getElementById('email-error').innerHTML = '';
        document.getElementById('address-error').innerHTML = '';
        document.getElementById('form-message').innerHTML = '';

        if (response.ok) {
            // 성공 처리
            document.getElementById('form-message').innerHTML = '회원가입 되셨습니다.';
        } else {
            // 오류가 있으면 필드별로 출력
            data.message.forEach(error => {
                if (error.username) {
                    document.getElementById('username-error').innerHTML = error.username;
                }
                if (error.password) {
                    document.getElementById('password-error').innerHTML = error.password;
                }
                if (error.password_confirm) {
                    document.getElementById('password-confirm-error').innerHTML = error.password_confirm;
                }
                if (error.name) {
                    document.getElementById('name-error').innerHTML = error.name;
                }
                if (error.email) {
                    document.getElementById('email-error').innerHTML = error.email;
                }
                if (error.address) {
                    document.getElementById('address-error').innerHTML = error.address;
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form-message').innerHTML = '서버 에러';
    }
});
