# import json
# import sys
# from hyperbolas import HyperPlotter
# from math import sqrt, cos, tan, isclose
# import numpy as np

# # Funzione per generare le iperboli dai dati
# def generate_hyperbolas(anchors, tdoa_data):
#     ref_id = tdoa_data["ref_id"]
#     recv_ids = tdoa_data["recv_ids"]
#     tdoa_distances = tdoa_data["tdoa_dist"]
    
#     plotter = HyperPlotter(anchors)
#     hyperbolas_data = {}

#     for recv_id, diff in zip(recv_ids, tdoa_distances):
#         x, y = plotter.mk_curves(ref_id, recv_id, diff)
#         hyperbolas_data[f'{ref_id}_{recv_id}'] = {'x': x, 'y': y}
    
#     return hyperbolas_data

# # Funzione per salvare le iperboli in formato JSON
# def convert_to_serializable(data):
#     if isinstance(data, np.matrix):
#         return data.tolist()  # Converte la matrice in una lista
#     if isinstance(data, np.ndarray):
#         return data.tolist()  # Converte l'array in una lista
#     return data  # Nessuna conversione necessaria

# def save_hyperbolas_to_json(hyperbolas_data, output_filepath):
#     # Applica la conversione a tutti i dati prima di salvarli
#     hyperbolas_data_serializable = {k: {'x': convert_to_serializable(v['x']),
#                                         'y': convert_to_serializable(v['y'])}
#                                     for k, v in hyperbolas_data.items()}
#     print(hyperbolas_data_serializable, output_filepath)
#     # with open(output_filepath, 'w') as json_file:
#     #     json.dump(hyperbolas_data_serializable, json_file, indent=4)

# # Modifica nella funzione hype per evitare il math domain error
# # class HyperPlotter:
# #     def __init__(self, anchors):
# #         self.anchors = anchors
# #         self.t_step = 0.1  # Step temporale (puoi adattarlo)

# #     def mk_curves(self, ref_id, recv_id, diff):
# #         # Funzione per generare curve iperboliche
# #         xa, ya = self.curve(self.anchors[ref_id], self.anchors[recv_id], diff)
# #         return xa, ya

# #     def curve(self, a, pair, t_start, t_step, bl, tr):
# #         # Genera curve iperboliche per un dato range temporale
# #         xa = []
# #         ya = []
# #         t = t_start
# #         while t < 2 * np.pi:  # Loop su t (puoi adattare il range)
# #             p = self.hype(a, t, pair)
# #             if p is not None:
# #                 xa.append(p[0, 0])
# #                 ya.append(p[1, 0])
# #             t += t_step
# #         return xa, ya

# #     def hype(self, a, t, attrs):
# #         try:
# #             # Verifica che attrs.c**2 - a**2 sia non negativo
# #             delta = attrs.c**2 - a**2
# #             if delta < 0 and not isclose(delta, 0):  # Aggiungi tolleranza
# #                 raise ValueError(f"Valore negativo per la radice quadrata: {delta}")
            
# #             h = np.matrix([[a / cos(t)], [sqrt(max(0, delta)) * tan(t)]])  # max(0, delta) evita numeri negativi
# #             return h
# #         except ValueError as e:
# #             print(f"Errore nella funzione 'hype': {e}")
# #             return None  # O restituisci un valore di fallback, se necessario

# # Main del programma
# if __name__ == "__main__":
#     if len(sys.argv) != 4:
#         print("Usage: python handleHyperbolas.py <input_json_filepath> <output_json_filepath> <tdoa_data_json>")
#         sys.exit(1)

#     input_filepath = sys.argv[1]
#     output_filepath = sys.argv[2]
#     tdoa_data = sys.argv[3]

#     # Decode the JSON string correttamente
#     tdoa_data = tdoa_data.replace('\\"', '"')
#     print(tdoa_data)
#     tdoa = json.loads(tdoa_data)

#     # Carica i dati degli anchor dal file JSON di input
#     with open(input_filepath, 'r') as file:
#         anchors_data = json.load(file)

#     # Estrai le coordinate degli anchor (solo i primi due valori)
#     anchors = {int(k): v['coords'][:2] for k, v in anchors_data['anchors'].items()}
#     # Aggiungi un controllo per verificare che le coordinate siano corrette
#     if not all(isinstance(v, (list, tuple)) and len(v) >= 2 for v in anchors.values()):
#         print("Errore: Dati delle coordinate degli anchor non corretti")
#         sys.exit(1)
#     # Genera le iperboli
#     hyperbolas_data = generate_hyperbolas(anchors, tdoa)
#     print(hyperbolas_data)
#     # Salva le iperboli in un file JSON
#     save_hyperbolas_to_json(hyperbolas_data, output_filepath)




import json
import sys
from hyperplotter import HyperPlotter
import numpy as np

# Funzione per generare le iperboli dai dati
def generate_hyperbolas(anchors, tdoa_data):
    ref_id = tdoa_data["ref_id"]
    recv_ids = tdoa_data["recv_ids"]
    tdoa_distances = tdoa_data["tdoa_dist"]
    pos = tdoa_data["pos"]
    # Controlla se i valori dell'array sono stringhe e se si convertile in numeri
    pos = [float(p) if isinstance(p, str) else p for p in pos]
    
    
    # Inizializza l'istanza di HyperPlotter con i dati degli anchor
    frame = ((-pos[0]-10, -pos[1]-10), (pos[0]+10, pos[1]+10)) if pos[0] > 20 or pos[1] > 20 else ((-20, -20), (20, 20))
    plotter = HyperPlotter(anchors, frame=frame)
    hyperbolas_data = {}

    # Per ogni coppia ref_id e recv_id, genera i punti delle iperboli
    for recv_id, diff in zip(recv_ids, tdoa_distances):
        x, y = plotter.mk_curves(ref_id, recv_id, -diff, single_branch=True)
        hyperbolas_data[f'{ref_id}_{recv_id}'] = {'x': x, 'y': y}
    
    return hyperbolas_data

# Funzione per convertire i dati in un formato serializzabile
def convert_to_serializable(data):
    if isinstance(data, np.ndarray):
        return data.tolist()  # Converte l'array in una lista
    return data  # Nessuna conversione necessaria

# Funzione per salvare le iperboli in un file JSON
def save_hyperbolas_to_json(hyperbolas_data, output_filepath):
    # Converte i dati in un formato compatibile con JSON
    hyperbolas_data_serializable = {k: {'x': convert_to_serializable(v['x']),
                                        'y': convert_to_serializable(v['y'])}
                                    for k, v in hyperbolas_data.items()}
    
    # Salva i dati in un file JSON
    with open(output_filepath, 'w') as json_file:
        json.dump(hyperbolas_data_serializable, json_file, indent=4)

# Main del programma
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python handleHyperbolas.py <input_json_filepath> <output_json_filepath> <tdoa_data_json>")
        sys.exit(1)

    input_filepath = sys.argv[1]
    output_filepath = sys.argv[2]
    tdoa_data = sys.argv[3]

    # Decodifica la stringa JSON correttamente
    tdoa_data = tdoa_data.replace('\\"', '"')
    tdoa = json.loads(tdoa_data)

    # Carica i dati degli anchor dal file JSON di input
    with open(input_filepath, 'r') as file:
        anchors_data = json.load(file)

    # Estrai le coordinate degli anchor (solo i primi due valori)
    anchors = {int(k): v['coords'][:2] for k, v in anchors_data['anchors'].items()}
    
    # Verifica che le coordinate siano corrette
    if not all(isinstance(v, (list, tuple)) and len(v) >= 2 for v in anchors.values()):
        print("Errore: Dati delle coordinate degli anchor non corretti")
        sys.exit(1)

    # Genera le iperboli
    hyperbolas_data = generate_hyperbolas(anchors, tdoa)

    # Salva le iperboli in un file JSON
    save_hyperbolas_to_json(hyperbolas_data, output_filepath)
