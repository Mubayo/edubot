from openai import OpenAI

from django.conf import settings
client = OpenAI(api_key=settings.OPENAI_API_KEY)

class OpenAIService:
    @staticmethod
    def get_response(prompt):
        # sk-None-sc7EzMnZbrwwggDjGsecT3BlbkFJ35mHjJtAra7y3t2dcJLz
        response = client.completions.create(engine="davinci-codex",
        prompt=prompt,
        max_tokens=150)
        return response.choices[0].text.strip()
