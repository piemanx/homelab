import requests
import json
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "192.168.1.1"
USERNAME = "gemini"
PASSWORD = "DaftPunk!2025"
BASE_URL = f"https://{IP}"

# Key without the comment
SSH_KEY_TYPE = "ssh-ed25519"
SSH_KEY_BLOB = "AAAAC3NzaC1lZDI1NTE5AAAAIPdY6MTP0nSzBqsXlioA+ffKL4D/2D3+Dk4fT9AGlpfY"
SSH_KEY_NAME = "Gemini_DevBox"

session = requests.Session()
session.verify = False

def login():
    headers = {"Content-Type": "application/json"}
    payload = {"username": USERNAME, "password": PASSWORD}
    try:
        resp = session.post(f"{BASE_URL}/api/auth/login", json=payload, headers=headers, timeout=10)
        if resp.status_code == 200:
            csrf_token = resp.headers.get('x-csrf-token')
            if csrf_token:
                session.headers.update({'x-csrf-token': csrf_token})
            return True
    except Exception as e:
        print(f"Login Error: {e}")
    return False

def update_ssh_settings():
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/get/setting")
        settings = resp.json().get('data', [])
        
        for setting in settings:
            if setting.get('key') == 'mgmt':
                print("Found Management Settings.")
                
                # 1. Disable Password Auth
                setting['x_ssh_auth_password_enabled'] = False
                
                # 2. Add SSH Key
                existing_keys = setting.get('x_ssh_keys', [])
                
                # Check if key already exists
                key_exists = False
                full_key_string = f"{SSH_KEY_TYPE} {SSH_KEY_BLOB} {SSH_KEY_NAME}"
                
                for k in existing_keys:
                    # Check if the blob matches
                    if SSH_KEY_BLOB in k.get('key', ''):
                        key_exists = True
                        break
                
                if not key_exists:
                    print("Adding SSH Key...")
                    existing_keys.append({
                        "name": SSH_KEY_NAME,
                        "key": f"{SSH_KEY_TYPE} {SSH_KEY_BLOB}", # Format: "type blob"
                        "comment": SSH_KEY_NAME
                    })
                    setting['x_ssh_keys'] = existing_keys
                
                print("Disabling SSH Password Auth...")
                
                update_url = f"{BASE_URL}/proxy/network/api/s/default/set/setting/mgmt"
                r = session.post(update_url, json=setting)
                print(f"SSH Update Status: {r.status_code}")
                if r.status_code != 200:
                    print(r.text)

    except Exception as e:
        print(f"Error updating SSH: {e}")

if __name__ == "__main__":
    if login():
        print("Logged in.")
        update_ssh_settings()
