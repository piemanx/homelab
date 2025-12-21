import requests
import json
import urllib3

# Suppress SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

IP = "192.168.1.1"
USERNAME = "gemini"
PASSWORD = "DaftPunk!2025"
BASE_URL = f"https://{IP}"

session = requests.Session()
session.verify = False

def login():
    headers = {"Content-Type": "application/json"}
    payload = {"username": USERNAME, "password": PASSWORD}
    try:
        resp = session.post(f"{BASE_URL}/api/auth/login", json=payload, headers=headers, timeout=10)
        if resp.status_code == 200:
            # IMPORTANT: Capture the CSRF token from headers
            csrf_token = resp.headers.get('x-csrf-token')
            if csrf_token:
                session.headers.update({'x-csrf-token': csrf_token})
            return True
    except Exception as e:
        print(f"Login Error: {e}")
    return False

def apply_hardening():
    # Fetch Settings first
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/get/setting")
        if resp.status_code != 200:
            print(f"Failed to fetch settings: {resp.status_code}")
            return

        settings = resp.json().get('data', [])
        
        for setting in settings:
            # 1. UPnP (USG Key)
            if setting.get('key') == 'usg':
                print(f"Current UPnP State: {setting.get('upnp_enabled')}")
                if setting.get('upnp_enabled') is not False:
                    print("Disabling UPnP...")
                    setting['upnp_enabled'] = False
                    setting['upnp_nat_pmp_enabled'] = False
                    setting['upnp_secure_mode'] = True
                    
                    update_url = f"{BASE_URL}/proxy/network/api/s/default/set/setting/usg"
                    r = session.post(update_url, json=setting)
                    print(f"UPnP Update Status: {r.status_code} - {r.text}")
                else:
                    print("UPnP is already disabled.")

            # 2. IPS (Threat Management)
            if setting.get('key') == 'ips':
                print(f"Current IPS Mode: {setting.get('ips_mode')}")
                if setting.get('ips_mode') != 'ips':
                    print("Enabling IPS Prevention Mode...")
                    setting['ips_mode'] = 'ips' # Prevention
                    setting['enabled_categories'] = [
                        "botcc", "compromised", "malware", "p2p", "tor", "user_agents", "shellcode" 
                        # Add more categories as needed, usually keeping existing ones is safer
                    ]
                    
                    update_url = f"{BASE_URL}/proxy/network/api/s/default/set/setting/ips"
                    r = session.post(update_url, json=setting)
                    print(f"IPS Update Status: {r.status_code} - {r.text}")
                else:
                    print("IPS Prevention is already active.")

    except Exception as e:
        print(f"Error during hardening: {e}")

if __name__ == "__main__":
    if login():
        print("Logged in with CSRF Token.")
        apply_hardening()
    else:
        print("Failed to login.")
