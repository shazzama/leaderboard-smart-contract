import openai 
from george_secrets import OPEN_API_KEY 
openai.api_key = OPEN_API_KEY

def generate_nft(game_name, score, user_identifier):
    response = openai.images.generate(
        model="dall-e-3",
        prompt="a white siamese cat",
        size="1024x1024",
        quality="standard",
        n=1,
    )
    return response["data"][0]["url"]