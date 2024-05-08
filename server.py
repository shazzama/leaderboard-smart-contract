
from flask import Flask, jsonify, request 
from address import generate_address
from nft import generate_nft
from smart_contract import leaderboard_smartcontract, nft_smartcontract, get_leaderboard_for_uuid

app = Flask(__name__)

# map game to uuid to high score
map = dict()

def update_map(game, uuid):
    if (map.get(game)):
        map[game].append(uuid)
    else:
        map[game] = [uuid]
    

# things we need 
# game name, score, identifier uuid

@app.route('/api/highscore', methods=['GET'])
def get_scores():
    scores = []

    game_name = request.json.get('game_name') 
    if (map.get(game_name)):
        for uuid in map.get(game_name):
            score = get_leaderboard_for_uuid(uuid)
            scores.append({"uuid":uuid, "score": score})
    
    scores.sort(key=lambda x: x["score"], reverse=True)

    return scores

@app.route('/api/update_leaderboard', methods=['POST'])
def update_leaderboard(): 
    # fetch from api request
    game_name = request.json.get('game_name') 
    score = request.json.get('score')
    user_identifier = request.json.get('user_identifier')
    print("game_name:", game_name)
    print ("score:", score)
    print ("user_identifier:", user_identifier)

    # generate address
    acct, private_key = generate_address()
    print("Address:", acct.address)
    print ("Private key:", private_key)

    # create NFT
    url = generate_nft(game_name, score, user_identifier)
    print(url)

    # mint NFT and leaderboards on chain 
    leaderboard_smartcontract(user_identifier, score)
    nft_smartcontract(acct.address, url)
    update_map(game_name, user_identifier)

    print("we are done, here is nft:")
    print(url)
    print("pub address: " + acct.address)
    return private_key

if __name__ == '__main__':
    app.run(debug=True)

# sample req
# curl -X POST -H "Content-Type: application/json" -d '{"game_name": "tetris", "score": "500", "user_identifier": "sam"}' http://localhost:5000/api/update_leaderboard
# curl -X GET -H "Content-Type: application/json" -d '{"game_name": "tetris"}' http://localhost:5000/api/highscore