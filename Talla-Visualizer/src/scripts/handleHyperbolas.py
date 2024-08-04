import json
import sys
from hyperbolas import HyperPlotter

def generate_hyperbolas(anchors, tdoa_data):
    ref_id = tdoa_data["ref_id"]
    recv_ids = tdoa_data["recv_ids"]
    tdoa_distances = tdoa_data["tdoa_dist"]
    
    plotter = HyperPlotter(anchors)
    hyperbolas_data = {}

    for recv_id, diff in zip(recv_ids, tdoa_distances):
        x, y = plotter.mk_curves(ref_id, recv_id, diff)
        hyperbolas_data[f'{ref_id}_{recv_id}'] = {'x': x, 'y': y}
    
    return hyperbolas_data

def save_hyperbolas_to_json(hyperbolas_data, output_filepath):
    with open(output_filepath, 'w') as json_file:
        json.dump(hyperbolas_data, json_file, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python handleHyperbolas.py <input_json_filepath> <output_json_filepath> <tdoa_data_json>")
        sys.exit(1)

    input_filepath = sys.argv[1]
    output_filepath = sys.argv[2]
    tdoa_data = sys.argv[3]

    # Decode the JSON string correctly
    tdoa_data = tdoa_data.replace('\\"', '"')
    tdoa = json.loads(tdoa_data)

    with open(input_filepath, 'r') as file:
        anchors_data = json.load(file)

    anchors = {int(k): v['coords'][:2] for k, v in anchors_data['anchors'].items()}
    
    hyperbolas_data = generate_hyperbolas(anchors, tdoa)
    save_hyperbolas_to_json(hyperbolas_data, output_filepath)
