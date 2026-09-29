from abc import ABC, abstractmethod
class VectorStore(ABC):
    @abstractmethod
    async def search(self, query: str, limit: int = 10) -> list[str]: raise NotImplementedError
