from fastapi import APIRouter, HTTPException
from app.schemas.repository import RepositoryValidateRequest, RepositoryValidateResponse
from app.services.github_service import parse_github_repo_url, validate_github_repo

router = APIRouter()

@router.post("/validate", response_model=RepositoryValidateResponse)
async def validate_repository(payload: RepositoryValidateRequest):
    try:
        owner, repo = parse_github_repo_url(payload.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        repo_data = await validate_github_repo(owner, repo, payload.token)
        return RepositoryValidateResponse(
            valid=True,
            owner=owner,
            repo=repo,
            default_branch=repo_data.get("default_branch"),
            private=repo_data.get("private"),
            message="Repository validated successfully",
        )
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
