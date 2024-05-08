from eth_account import Account
import secrets

def generate_address(): 
    priv = secrets.token_hex(32)
    private_key = "0x" + priv
    acct = Account.from_key(private_key)

    return acct, private_key
