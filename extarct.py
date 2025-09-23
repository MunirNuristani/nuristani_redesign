#!/usr/bin/env python3
import json
import csv

# Input/Output file paths
input_json_file = 'WordBank.json'
output_csv_file = 'output.csv'

# Load JSON array from file
with open(input_json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Write to CSV
with open(output_csv_file, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Word', 'ABBR', 'pronunciation', 'Meaning']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for item in data:
        writer.writerow({
            'Word': item.get('Word', ''),
            'ABBR': item.get('ABBR', ''),
            'pronunciation': item.get('pronunciation', ''),
            'Meaning': item.get('Meaning', '')
        })

print("✅ Unicode decoded and CSV saved to:", output_csv_file)
