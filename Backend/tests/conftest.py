import sys
import os

# Add backend root directory to Python path BEFORE importing database or main
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base, get_db
from main import app

# Test database URL
TEST_DATABASE_URL = "postgresql://postgres:admin123@localhost/waterdb_test"

# Create test engine
engine = create_engine(TEST_DATABASE_URL)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override DB Dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after tests
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    # Override dependency
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.fixture
def db_session():
    """Returns a test DB session."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
