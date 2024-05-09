
from flask import Flask, jsonify, request 
from address import generate_address
from nft import generate_nft
from smart_contract import leaderboard_smartcontract, nft_smartcontract, get_leaderboard
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app)
# CORS(app, support_credentials=True)

# map game to uuid to high score
map = dict()

def update_map(game, uuid):
    if (map.get(game)):
        map[game].append(uuid)
    else:
        map[game] = [uuid]
    

# things we need 
# game name, score, identifier uuid

# curl -X GET -H "Content-Type: application/json" -d '{"game_name": "tetris"}' http://localhost:5000/api/highscore
@app.route('/api/highscore', methods=['GET'])
def highscore():
    scores = []

    print("****************")
    print(request.args.get('game_name'))
    print("****************")
    game_name = request.args.get('game_name')

    from_blockchain = get_leaderboard()
    print(from_blockchain)

    for data in from_blockchain:
        score = get_leaderboard()
        scores.append({"uuid":data['uuid'], "score": data['score']})
    
    scores.sort(key=lambda x: x["score"], reverse=True)

    return scores

@app.route('/api/update_leaderboard', methods=['POST'])
def update_leaderboard(): 
    # fetch from api request
    data = json.loads(request.data.decode('utf-8'))

    print(data)
    game_name = data['data']['game_name']
    score = data['data']['score']
    user_identifier = data['data']['user_identifier']
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

@app.route('/api/mint_nft')
def mint_nft():
    # TODO NOT TESTED
    # generate address
    acct, private_key = generate_address()
    print("Address:", acct.address)
    print ("Private key:", private_key)

    # create NFT
    url = generate_nft(game_name, score, user_identifier)
    print(url)

    # smart contract
    nft_smartcontract(acct.address, url)



if __name__ == '__main__':
    app.run(debug=True)

# sample req
# curl -X POST -H "Content-Type: application/json" -d '{"game_name": "tetris", "score": "500", "user_identifier": "sam"}' http://localhost:5000/api/update_leaderboard
# curl -X GET -H "Content-Type: application/json" -d '{"game_name": "tetris"}' http://localhost:5000/api/highscore