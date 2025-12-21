import requests
import json
import urllib3

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

def analyze_firewall():
    print("--- FIREWALL ANALYSIS ---")
    
    # 1. Rules
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/rest/firewallrule")
        rules = resp.json().get('data', [])
        
        print(f"Total Rules Found: {len(rules)}")
        
        # Categorize
        wan_in = [r for r in rules if r.get('ruleset') == 'WAN_IN']
        lan_in = [r for r in rules if r.get('ruleset') == 'LAN_IN']
        lan_local = [r for r in rules if r.get('ruleset') == 'LAN_LOCAL']
        
        print(f"\nWAN_IN (Internet -> LAN): {len(wan_in)}")
        for r in wan_in:
            if r.get('enabled'):
                print(f"  - [{r['action']}] {r['name']} (Proto: {r.get('protocol', 'all')})")

        print(f"\nLAN_IN (VLAN -> VLAN): {len(lan_in)}")
        for r in lan_in:
            if r.get('enabled'):
                print(f"  - [{r['action']}] {r['name']} (Src: {r.get('src_networkconf_id', 'any')} -> Dst: {r.get('dst_networkconf_id', 'any')})")

    except Exception as e:
        print(f"Error fetching rules: {e}")

    # 2. Port Forwarding
    try:
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/rest/portforward")
        forwards = resp.json().get('data', [])
        
        print(f"\nPort Forwards: {len(forwards)}")
        for pf in forwards:
            if pf.get('enabled'):
                print(f"  - {pf['name']}: {pf['src']} -> {pf['fwd']} ({pf['proto']})")
    except Exception as e:
        print(f"Error fetching port forwards: {e}")

if __name__ == "__main__":
    if login():
        analyze_firewall()
    else:
        print("Failed to login.")
