
from flask import Flask, jsonify, request 
from address import generate_address
from nft import generate_nft
from smart_contract import leaderboard_smartcontract, nft_smartcontract

app = Flask(__name__)





tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

# map game to uuid to high score
map = dict()

def update_map(game, uuid):
    if (map.get(game)):
        map[game].add(uuid)
    else:
        map[game] = set(uuid)
    

# things we need 
# game name, score, identifier uuid

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})

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
    # acct, private_key = generate_address()
    # print("Address:", acct.address)
    # print ("Private key:", private_key)

    # create NFT
    # nft = generate_nft(game_name, score, user_identifier)
    # print(nft)

    # mint NFT and leaderboards on chain 
    leaderboard_smartcontract(user_identifier, score)
    nft_smartcontract() 

    update_map(game_name, user_identifier)

    return "success"

if __name__ == '__main__':
    app.run(debug=True)

# sample req
# curl -X POST -H "Content-Type: application/json" -d '{"game_name": "tetris", "score": "500", "user_identifier": "sam"}' http://localhost:5000/api/update_leaderboard
