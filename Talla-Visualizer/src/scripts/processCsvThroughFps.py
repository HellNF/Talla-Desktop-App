import sys
import os
import pandas as pd
import json

def process_and_split_csv(input_file, fps):
    # Definisci i tipi di dati per le colonne specifiche
    dtype_spec = {
        'column_name_4': str,  # Sostituisci 'column_name_4' con il nome effettivo della colonna 4
        'column_name_5': str   # Sostituisci 'column_name_5' con il nome effettivo della colonna 5
    }

    # Leggi il file CSV
    try:
        df = pd.read_csv(input_file, dtype=dtype_spec, low_memory=False)
    except FileNotFoundError:
        print(f"File not found: {input_file}")
        sys.exit(1)
    except pd.errors.EmptyDataError:
        print(f"No data: {input_file}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading {input_file}: {e}")
        sys.exit(1)
    
    # Determina quale colonna temporale usare
    if 'abs_time' in df.columns:
        time_column = 'abs_time'
        df[time_column] = pd.to_datetime(df[time_column])
        df['seconds'] = (df[time_column] - df[time_column].min()).dt.total_seconds()
    elif 'time' in df.columns:
        time_column = 'time'
        df[time_column] = df[time_column].astype(float)
        df['seconds'] = df[time_column]
    else:
        raise ValueError("Neither 'abs_time' nor 'time' columns are found in the CSV file.")
    
    # Converti il tempo in frame
    df['frame'] = (df['seconds'] * fps).astype(int)
    
    # Crea la directory di output se non esiste
    output_dir = os.path.join(os.path.dirname(input_file), 'processed_data', f'{fps}fps')
    os.makedirs(output_dir, exist_ok=True)
    
    # Crea un dizionario per l'indice
    index_data = {
        'total_frames': int(df['frame'].max()),
        'tags': []
    }
    
    # Dividi i dati per `tag_id` e salva ogni `tag_id` in un file CSV separato
    grouped = df.groupby('tag_id')
    
    for tag_id, group in grouped:
        # Etichettatura di 'main' e 'footprint'
        group['label'] = 'footprint'
        group['rank'] = group.groupby('frame')[time_column].rank(method='first', ascending=False)
        group.loc[group['rank'] == 1, 'label'] = 'main'
        group.drop(columns=['rank'], inplace=True)
        
        # Salva il gruppo come CSV
        output_file = os.path.join(output_dir, f'{tag_id}_{fps}.csv')
        group.reset_index(drop=True, inplace=True)  # Resetta l'indice per una migliore struttura CSV
        group.to_csv(output_file, index=False)
        print(f'Saved {output_file}')
        
        # Aggiungi informazioni al file index.json
        index_data['tags'].append({
            'tag_id': tag_id,
            'file': f'{tag_id}_{fps}.csv',
            'frames': int(group['frame'].nunique())
        })
    
    # Salva l'indice come JSON
    index_file = os.path.join(output_dir, 'index.json')
    with open(index_file, 'w') as f:
        json.dump(index_data, f, indent=4)
    print(f'Saved {index_file}')
    
    print('Processing completed.')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_and_split_csv.py <path_to_csv_file> <fps>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    fps = int(sys.argv[2])
    
    process_and_split_csv(input_file, fps)
