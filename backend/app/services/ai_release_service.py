import os
from pathlib import Path

from dotenv import load_dotenv

from app.schemas.release import (
    AIReleaseContent,
    ReleaseCommit,
    ReleaseGenerateRequest,
)

from app.services.ai_errors import (
    AIConfigurationError,
    AIGenerationError,
)

from app.services.gemini_release_service import (
    generate_gemini_release_content,
)

from app.services.openai_release_service import (
    AIConfigurationError as OpenAIConfigurationError,
    AIGenerationError as OpenAIGenerationError,
    generate_openai_release_content,
)


BACKEND_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BACKEND_DIR / ".env")


def _get_provider() -> str:
    provider = os.getenv(
        "AI_PROVIDER",
        "gemini",
    ).strip().lower()

    if provider not in {
        "gemini",
        "openai",
    }:
        raise AIConfigurationError(
            "AI_PROVIDER must be either gemini or openai"
        )

    return provider


async def generate_ai_release_content(
    payload: ReleaseGenerateRequest,
    commits: list[ReleaseCommit],
) -> AIReleaseContent:
    provider = _get_provider()

    if provider == "gemini":
        return await generate_gemini_release_content(
            payload,
            commits,
        )

    try:
        return await generate_openai_release_content(
            payload,
            commits,
        )

    except OpenAIConfigurationError as error:
        raise AIConfigurationError(
            str(error)
        ) from error

    except OpenAIGenerationError as error:
        raise AIGenerationError(
            str(error)
        ) from error
