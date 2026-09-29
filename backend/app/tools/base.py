from abc import ABC, abstractmethod
from typing import Any
class Tool(ABC):
    name: str
    @abstractmethod
    async def ainvoke(self, input_data: dict[str, Any]) -> dict[str, Any]: raise NotImplementedError
