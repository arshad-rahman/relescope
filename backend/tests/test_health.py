import unittest

from fastapi.testclient import TestClient

from main import app


class TestApplicationHealth(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)


    def test_root_endpoint(self) -> None:
        response = self.client.get("/")

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "message":
                    "Relescope backend is running",
            },
        )


    def test_health_endpoint(self) -> None:
        response = self.client.get(
            "/health",
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.json(),
            {
                "status": "healthy",
            },
        )


    def test_frontend_container_cors(
        self,
    ) -> None:
        response = self.client.options(
            "/health",
            headers={
                "Origin":
                    "http://localhost:8080",
                "Access-Control-Request-Method":
                    "GET",
            },
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertEqual(
            response.headers.get(
                "access-control-allow-origin",
            ),
            "http://localhost:8080",
        )


    def test_openapi_document(self) -> None:
        response = self.client.get(
            "/openapi.json",
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        document = response.json()

        self.assertEqual(
            document["info"]["title"],
            "Relescope API",
        )

        self.assertIn(
            "/health",
            document["paths"],
        )


if __name__ == "__main__":
    unittest.main()
