function handleLogin(event) {
    event.preventDefault();
    const username = getEleById('username').value;
    const password = getEleById('password').value;
    console.log('Username:', username);
    console.log('Password:', password);
    if (username === 'admin' && password === 'admin123') {
        alert('Login successful!');
        window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
        alert('Invalid credentials!');
    }
}