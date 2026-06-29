import os
import json
import redis
import requests
from kafka import KafkaConsumer

SIEM_API_URL = os.environ.get('SIEM_API_URL', 'https://siem.omniaguard.com/api/v1')
REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
KAFKA_BROKER = os.environ.get('KAFKA_BROKER', 'localhost:9092')
ALERT_TOPIC = 'alerts'

redis_client = redis.Redis(host=REDIS_HOST, decode_responses=True)
consumer = KafkaConsumer(ALERT_TOPIC, bootstrap_servers=[KAFKA_BROKER])

def update_siem(alert_id, status, triage_reason):
    url = f"{SIEM_API_URL}/alerts/{alert_id}"
    headers = {'Content-Type': 'application/json'}
    data = json.dumps({
        "status": status,
        "triage_reason": triage_reason,
        "agent_id": "SwarmAgent-Triage"
    })
    try:
        response = requests.put(url, headers=headers, data=data)
        if response.status_code != 200:
            print(f"Error updating SIEM: {response.status_code}")
    except Exception as e:
        print(f"Error updating SIEM: {e}")

def process_alert(alert_data):
    try:
        required_keys = ['source_ip', 'event_type', 'alert_id']
        if not all(key in alert_data for key in required_keys):
            print(f"Invalid alert data: Missing required keys. Data: {alert_data}")
            return

        key = f"{alert_data['source_ip']}:{alert_data['event_type']}"
        if redis_client.exists(key):
            triage_reason = redis_client.get(key)
            update_siem(alert_data['alert_id'], "Triaged - False Positive", triage_reason)
            return

        internal_scanners = os.environ.get('INTERNAL_SCANNERS', '').split(',')
        if alert_data['source_ip'] in internal_scanners and 'scan' in alert_data['event_type'].lower():
            update_siem(alert_data['alert_id'], "Triaged - False Positive", "Matched internal scanner")
            return

        update_siem(alert_data['alert_id'], "Open", "Requires manual review")

    except Exception as e:
        print(f"Error processing alert {alert_data.get('alert_id', 'unknown')}: {e}")

if __name__ == '__main__':
    print("OmniaGuard Alert Triage Agent started...")
    for message in consumer:
        try:
            try:
                alert_data = json.loads(message.value.decode('utf-8'))
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from Kafka message: {e}")
                continue
            process_alert(alert_data)
        except Exception as e:
            print(f"Error processing Kafka message: {e}")
