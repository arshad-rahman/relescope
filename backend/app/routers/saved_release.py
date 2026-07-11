from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Response,
    status as http_status,
)

from sqlalchemy.exc import (
    SQLAlchemyError,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.saved_release import (
    ExperienceMode,
    ReleaseStatus,
    SavedReleaseCreate,
    SavedReleaseListResponse,
    SavedReleaseResponse,
    SavedReleaseUpdate,
)

from app.services.saved_release_service import (
    create_saved_release,
    delete_saved_release,
    get_saved_release,
    list_saved_releases,
    update_saved_release,
)


router = APIRouter()

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def require_saved_release(
    database: Session,
    release_id: int,
    owner_login: str,
):
    saved_release = get_saved_release(
        database,
        release_id,
        owner_login,
    )

    if saved_release is None:
        raise HTTPException(
            status_code=404,
            detail="Saved release was not found",
        )

    return saved_release


@router.post(
    "",
    response_model=SavedReleaseResponse,
    status_code=http_status.HTTP_201_CREATED,
)
def create_release_record(
    payload: SavedReleaseCreate,
    database: DatabaseSession,
) -> SavedReleaseResponse:
    try:
        return create_saved_release(
            database,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to save the release"
            ),
        ) from error


@router.get(
    "",
    response_model=SavedReleaseListResponse,
)
def list_release_records(
    database: DatabaseSession,

    owner_login: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),

    status: ReleaseStatus | None = Query(
        default=None,
    ),

    experience_mode: (
        ExperienceMode | None
    ) = Query(
        default=None,
    ),

    repository: str | None = Query(
        default=None,
        min_length=1,
        max_length=255,
    ),

    limit: int = Query(
        default=50,
        ge=1,
        le=100,
    ),

    offset: int = Query(
        default=0,
        ge=0,
    ),
) -> SavedReleaseListResponse:
    items, total = list_saved_releases(
        database,
        owner_login,
        status=status,
        experience_mode=experience_mode,
        repository=repository,
        limit=limit,
        offset=offset,
    )

    return SavedReleaseListResponse(
        items=items,
        total=total,
        limit=limit,
        offset=offset,
    )


@router.get(
    "/{release_id}",
    response_model=SavedReleaseResponse,
)
def get_release_record(
    release_id: int,
    database: DatabaseSession,

    owner_login: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
) -> SavedReleaseResponse:
    return require_saved_release(
        database,
        release_id,
        owner_login,
    )


@router.patch(
    "/{release_id}",
    response_model=SavedReleaseResponse,
)
def update_release_record(
    release_id: int,
    payload: SavedReleaseUpdate,
    database: DatabaseSession,

    owner_login: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
) -> SavedReleaseResponse:
    saved_release = require_saved_release(
        database,
        release_id,
        owner_login,
    )

    try:
        return update_saved_release(
            database,
            saved_release,
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to update the release"
            ),
        ) from error


@router.delete(
    "/{release_id}",
    status_code=http_status.HTTP_204_NO_CONTENT,
)
def delete_release_record(
    release_id: int,
    database: DatabaseSession,

    owner_login: str = Query(
        ...,
        min_length=1,
        max_length=100,
    ),
) -> Response:
    saved_release = require_saved_release(
        database,
        release_id,
        owner_login,
    )

    try:
        delete_saved_release(
            database,
            saved_release,
        )
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to delete the release"
            ),
        ) from error

    return Response(
        status_code=(
            http_status.HTTP_204_NO_CONTENT
        ),
    )
