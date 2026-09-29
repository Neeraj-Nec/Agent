from app.tools.base import Tool
class ToolRegistry:
    def __init__(self) -> None: self.tools: dict[str, Tool] = {}
    def register(self, tool: Tool) -> None: self.tools[tool.name] = tool
    def get(self, name: str) -> Tool: return self.tools[name]
