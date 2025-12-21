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
            return True
    except Exception as e:
        print(f"Login Error: {e}")
    return False

def apply_hardening():
    # 1. Disable UPnP
    # Need to find the WAN network first
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/rest/networkconf")
        networks = resp.json().get('data', [])
        
        for net in networks:
            if net.get('purpose') == 'wan': # Usually the WAN network
                print(f"Disabling UPnP for WAN: {net.get('name')}")
                # Update payload
                net_id = net['_id']
                payload = {
                    "upnp_lan_enabled": False, # This is often on the LAN side, checking mapping
                    "igmp_proxy_upstream": False
                }
                # Note: In newer UniFi OS, UPnP is often a service setting, checking settings list...
    except Exception as e:
        print(f"Error fetching networks: {e}")

    # Alternative: Check 'usg' setting for UPnP
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/get/setting")
        settings = resp.json().get('data', [])
        
        for setting in settings:
            if setting.get('key') == 'usg':
                print("Found USG/Gateway Settings. Disabling UPnP...")
                setting['upnp_enabled'] = False
                setting['upnp_nat_pmp_enabled'] = False
                setting['upnp_secure_mode'] = True
                
                # Apply update
                update_url = f"{BASE_URL}/proxy/network/api/s/default/set/setting/usg"
                r = session.post(update_url, json=setting)
                print(f"UPnP Update Status: {r.status_code}")

            if setting.get('key') == 'ips':
                print("Found IPS Settings. Enabling Prevention Mode...")
                setting['ips_mode'] = 'ips' # 'ips' = Prevention, 'ids' = Detection
                
                # Apply update
                update_url = f"{BASE_URL}/proxy/network/api/s/default/set/setting/ips"
                r = session.post(update_url, json=setting)
                print(f"IPS Update Status: {r.status_code}")
                
    except Exception as e:
        print(f"Error updating settings: {e}")

if __name__ == "__main__":
    if login():
        print("Logged in. Applying Phase 1 Hardening...")
        apply_hardening()
    else:
        print("Failed to login.")
