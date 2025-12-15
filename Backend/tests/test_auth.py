from utils import verify_password, hash_password
from auth_handler import create_access_token, decode_access_token


def test_register_user(client):
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password@123",
        "role": "citizen",
        "location": "Chennai"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"


def test_register_duplicate_email(client):
    # First registration
    client.post("/auth/register", json={
        "name": "User A",
        "email": "dup@example.com",
        "password": "Password@123",
        "role": "citizen",
        "location": "chennai"
    })

    # Duplicate registration
    response = client.post("/auth/register", json={
        "name": "User B",
        "email": "dup@example.com",
        "password": "Password@123",
        "role": "citizen",
        "location": "chennai"
    })

    # Should fail due to unique email constraint
    assert response.status_code == 500 or response.status_code == 400


def test_login_success(client):
    # Register first
    client.post("/auth/register", json={
        "name": "Login User",
        "email": "login@example.com",
        "password": "Password@123",
        "location": "chennai"
    })

    # Now login
    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "Password@123"
    })

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_email(client):
    response = client.post("/auth/login", json={
        "email": "wrong@example.com",
        "password": "Password@123"
    })

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email or password"


def test_login_wrong_password(client):
    # Register
    client.post("/auth/register", json={
        "name": "WrongPass User",
        "email": "wp@example.com",
        "password": "Password@123",
        "location": "chennai"
    })

    # Wrong password
    response = client.post("/auth/login", json={
        "email": "wp@example.com",
        "password": "WrongPass@1"
    })

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid email or password"


def test_logout(client):
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Logged out successfully"


def test_password_hashing():
    plain = "Password@123"
    hashed = hash_password(plain)

    assert hashed != plain
    assert verify_password(plain, hashed) == True


def test_jwt_token_creation():
    token = create_access_token({"sub": "test@example.com"})
    decoded = decode_access_token(token)

    assert decoded["sub"] == "test@example.com"
