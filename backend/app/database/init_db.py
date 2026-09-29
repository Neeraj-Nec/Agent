import asyncio

from app.database.base import Base
from app.database.connection import get_engine
from app.database import models  # noqa: F401


async def init_db() -> None:
    async with get_engine().begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(init_db())
