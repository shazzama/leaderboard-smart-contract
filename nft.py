import openai 
from george_secrets import OPEN_API_KEY 
import requests 
from PIL import Image
import io

openai.api_key = OPEN_API_KEY

def generate_nft(prompt):
    response = openai.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    url = response.data[0].url
    return url
