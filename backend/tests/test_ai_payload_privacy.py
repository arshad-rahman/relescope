import unittest

from app.schemas.release import (
    ReleaseCommit,
    ReleaseGenerateRequest,
)
from app.services.gemini_release_service import (
    _build_input as build_gemini_input,
)
from app.services.openai_release_service import (
    _build_input as build_openai_input,
)


class TestAIPayloadPrivacy(unittest.TestCase):
    def setUp(self) -> None:
        self.private_email = (
            "private-contributor@example.com"
        )

        self.payload = ReleaseGenerateRequest(
            repository="demo/demo-backend",
            branch="main",
            title="Weekly Release",
            version="v1.1.0",
            environment="Staging",
            generate_for="all",
            selected_author="",
            commits=[
                ReleaseCommit(
                    id="abc1234",
                    message=(
                        "Add order cancellation "
                        "endpoint and tests"
                    ),
                    author="alice.dev",
                    author_email=self.private_email,
                    date="2026-07-24T10:00:00Z",
                ),
            ],
        )

    def test_gemini_payload_excludes_email(self) -> None:
        generated_input = build_gemini_input(
            self.payload,
            self.payload.commits,
        )

        self.assertNotIn(
            self.private_email,
            generated_input,
        )
        self.assertNotIn(
            '"author_email"',
            generated_input,
        )
        self.assertIn(
            "alice.dev",
            generated_input,
        )

    def test_openai_payload_excludes_email(self) -> None:
        generated_input = build_openai_input(
            self.payload,
            self.payload.commits,
        )

        self.assertNotIn(
            self.private_email,
            generated_input,
        )
        self.assertNotIn(
            '"author_email"',
            generated_input,
        )
        self.assertIn(
            "alice.dev",
            generated_input,
        )


if __name__ == "__main__":
    unittest.main()
