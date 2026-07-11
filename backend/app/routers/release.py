from fastapi import (
    APIRouter,
    HTTPException,
)

from app.schemas.release import (
    ReleaseGenerateRequest,
    ReleaseNotesResponse,
)

from app.services.ai_errors import (
    AIConfigurationError,
    AIGenerationError,
)

from app.services.release_service import (
    generate_release_notes,
)


router = APIRouter()


@router.post(
    "/generate",
    response_model=ReleaseNotesResponse,
)
async def generate_release(
    payload: ReleaseGenerateRequest,
) -> ReleaseNotesResponse:
    try:
        return await generate_release_notes(
            payload
        )

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except AIConfigurationError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from error

    except AIGenerationError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate release notes",
        ) from error
