from web3 import Web3
from george_secrets import PRIVATE_KEY
import numpy

# Initialize endpoint URL
node_url = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/jBRChpnSq4EoKwhVB7qYHuQDwMYRa1au"

def connect_to_web3():
    # Create the node connection
    web3 = Web3(Web3.HTTPProvider(node_url))
    if web3.is_connected():
        print("-" * 50)
        print("Connection Successful")
        print("-" * 50)
    else:
        print("Connection Failed")
    return web3 

def initialize_smart_contract():
    web3 = connect_to_web3()

    # Initialize the address calling the functions/signing transactions
    caller = "0x9E79ee00A49e7221834d532Baf8182A4F08c536e"
    private_key = PRIVATE_KEY  # To sign the transaction

    # Initialize address nonce
    nonce = web3.eth.get_transaction_count(caller)

    # Initialize contract ABI and address
    abi = '[{"inputs":[{"internalType":"address","name":"trustedUpdater","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TRUSTED_UPDATER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"uuid","type":"string"}],"name":"getScore","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"leaderboard","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"uuid","type":"string"},{"internalType":"uint256","name":"score","type":"uint256"}],"name":"updateLeaderboard","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
    contract_address = Web3.to_checksum_address("0x66ced037dd035e85a4b3deb342205aa25c715364")

    # Create smart contract instance
    contract = web3.eth.contract(address=contract_address, abi=abi)
    return contract, caller, nonce, private_key

def leaderboard_smartcontract(uuid, score):
    web3 = connect_to_web3()
    contract, caller, nonce, private_key = initialize_smart_contract()

    # initialize the chain id, we need it to build the transaction for replay protection
    Chain_id = web3.eth.chain_id

    # Call your function
    call_function = contract.functions.updateLeaderboard(uuid, int(score)).build_transaction({"chainId": Chain_id, "from": caller, "nonce": nonce})

    # Sign transaction
    signed_tx = web3.eth.account.sign_transaction(call_function, private_key=private_key)

    # Send transaction
    send_tx = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

    # Wait for transaction receipt
    tx_receipt = web3.eth.wait_for_transaction_receipt(send_tx)
    print(tx_receipt) # Optional

    print("leaderboard smartcontract")

def nft_smartcontract():
    print("nft smartcontract")