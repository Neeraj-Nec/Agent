from abc import ABC, abstractmethod
class LanguageModel(ABC):
    @abstractmethod
    async def generate(self, prompt: str) -> str: raise NotImplementedError
