import httpx
import base64
import asyncio
import logging
from config import GEM_API_KEY

logger = logging.getLogger(__name__)

API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key={GEM_API_KEY}"

_request_count = 0

async def generate_thumbnail(
    prompt: str,
    style_prompt: str,
    headshot_url: str
) -> bytes:
    global _request_count
    
    await asyncio.sleep(_request_count * 10)
    _request_count += 1

    full_prompt = (
        f"{style_prompt}\n\n"
        f"User request: {prompt}\n\n"
        "Generate a YouTube thumbnail image, professional, high quality, 1280x720"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": full_prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"]
        }
    }

    async with httpx.AsyncClient(timeout=180) as client:
        for attempt in range(3):
            response = await client.post(API_URL, json=payload)
            if response.status_code == 429:
                await asyncio.sleep(60)
                continue
            response.raise_for_status()
            break
        data = response.json()

    logger.info(f"Gemini response keys: {data.keys()}")
    logger.info(f"Gemini response: {str(data)[:500]}")

    if "candidates" not in data:
        raise RuntimeError(f"Unexpected response: {str(data)[:300]}")

    for part in data["candidates"][0]["content"]["parts"]:
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])

    raise RuntimeError("No image in Gemini response")