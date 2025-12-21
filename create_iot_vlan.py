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
            csrf_token = resp.headers.get('x-csrf-token')
            if csrf_token:
                session.headers.update({'x-csrf-token': csrf_token})
            return True
    except Exception as e:
        print(f"Login Error: {e}")
    return False

def create_iot_network():
    print("Creating IoT Network (VLAN 20)...")
    
    # 1. Create the Network
    network_payload = {
        "name": "IoT",
        "purpose": "corporate", # "corporate" allows VLANs. "guest" applies isolation automatically.
        "vlan_enabled": True,
        "vlan": 20,
        "ip_subnet": "192.168.20.1/24",
        "domain_name": "iot",
        "is_nat": True,
        "dhcpd_enabled": True,
        "dhcpd_start": "192.168.20.6",
        "dhcpd_stop": "192.168.20.254",
        "dhcpd_leasetime": 86400,
        "igmp_snooping": True, # CRITICAL for Google Cast / Nest to work across VLANs
        "mdns_enabled": True,  # CRITICAL for discovering Cast devices across VLANs
        "ipv6_interface_type": "none"
    }
    
    try:
        # Check if it exists first
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/rest/networkconf")
        existing = resp.json().get('data', [])
        for net in existing:
            if net.get('name') == "IoT":
                print("IoT Network already exists. Skipping creation.")
                return net['_id']

        # Create
        resp = session.post(f"{BASE_URL}/proxy/network/api/s/default/rest/networkconf", json=network_payload)
        if resp.status_code == 200:
            print("IoT Network Created Successfully.")
            return resp.json()['data'][0]['_id']
        else:
            print(f"Failed to create network: {resp.text}")
            return None
            
    except Exception as e:
        print(f"Error creating network: {e}")
        return None

def create_iot_wifi(network_id):
    print("Creating IoT Wi-Fi (BouChat_IoT)...")
    
    wifi_payload = {
        "name": "BouChat_IoT",
        "enabled": True,
        "wlan_band": "both",
        "security": "wpapsk",
        "x_passphrase": "ChangeMe123!", # Placeholder password
        "networkconf_id": network_id,
        "mac_filter_enabled": False,
        "is_guest": False, # Use Corporate so we can manage firewall rules manually
        "wpa_mode": "wpa2",
        "wpa3_support": False # Stick to WPA2 for max IoT compatibility
    }
    
    try:
        # Check if exists
        resp = session.get(f"{BASE_URL}/proxy/network/api/s/default/rest/wlanconf")
        existing = resp.json().get('data', [])
        for wlan in existing:
            if wlan.get('name') == "BouChat_IoT":
                print("IoT Wi-Fi already exists.")
                return

        # Create
        resp = session.post(f"{BASE_URL}/proxy/network/api/s/default/rest/wlanconf", json=wifi_payload)
        if resp.status_code == 200:
            print("IoT Wi-Fi Created Successfully.")
        else:
            print(f"Failed to create Wi-Fi: {resp.text}")
            
    except Exception as e:
        print(f"Error creating Wi-Fi: {e}")

if __name__ == "__main__":
    if login():
        net_id = create_iot_network()
        if net_id:
            create_iot_wifi(net_id)
            print("\nSUCCESS! Phase 2 Setup Complete.")
            print("1. IoT Network (192.168.20.1/24) created.")
            print("2. mDNS and IGMP Snooping enabled (Required for Google Cast).")
            print("3. Wi-Fi 'BouChat_IoT' created (Password: ChangeMe123!).")
            print("\nNEXT STEPS (Manual):")
            print("- Go to Settings -> Firewall & Security -> Firewall Rules.")
            print("- Create 'LAN IN' rule to Block IoT -> LAN.")
            print("- Change the Wi-Fi password for BouChat_IoT.")
    else:
        print("Failed to login.")
