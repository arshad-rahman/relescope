from pydantic import BaseModel, Field
from typing import Optional


class RepositoryValidateRequest(BaseModel):
    url: str = Field(..., examples=["https://github.com/arshad-rahman/releasepilot"])
    token: str = Field(..., min_length=10)
    remember_token: bool = False


class RepositoryValidateResponse(BaseModel):
    valid: bool
    owner: Optional[str] = None
    repo: Optional[str] = None
    default_branch: Optional[str] = None
    private: Optional[bool] = None
    message: str
