from cryptography.fernet import Fernet
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64
import binascii

key_hex = b'a5e28ef45588a3ec41e12c57b4d8684df18af4a29039851e1d55a82fbb5ca8de'
key = binascii.unhexlify(key_hex)

def decrypt_password(encrypted: str) -> str:
    iv_hex, b64_ciphertext = encrypted.split(":")
    iv = bytes.fromhex(iv_hex)
    ciphertext = base64.b64decode(b64_ciphertext)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)
    return decrypted.decode("utf-8")

# SECRET_KEY = b'LnFji9TC7YI5O3i-kUIjr2uXkwR9BOKaW1QXVCL9uiQ='  # Must be 32 bytes
# fernet = Fernet(SECRET_KEY)

# def decrypt_password(encrypted_password: str) -> str:
#     return fernet.decrypt(encrypted_password.encode()).decode()


# from cryptography.fernet import Fernet

# SECRET_KEY = b'LnFji9TC7YI5O3i-kUIjr2uXkwR9BOKaW1QXVCL9uiQ='
# fernet = Fernet(SECRET_KEY)

# def encrypt_password(password: str) -> str:
#     return fernet.encrypt(password.encode()).decode()

# def decrypt_password(encrypted_password: str) -> str:
#     return fernet.decrypt(encrypted_password.encode()).decode()
