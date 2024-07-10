import sys
import os
import pandas as pd

def process_and_split_csv(input_file, fps):
    # Leggi il file CSV
    try:
        df = pd.read_csv(input_file)
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
    output_dir = os.path.join(os.path.dirname(input_file), 'processed_data')
    os.makedirs(output_dir, exist_ok=True)
    
    # Dividi i dati per `tag_id` e salva ogni `tag_id` in un file JSON separato
    grouped = df.groupby('tag_id')
    
    for tag_id, group in grouped:
        output_file = os.path.join(output_dir, f'{tag_id}.json')
        group.reset_index(drop=True, inplace=True)  # Resetta l'indice per una migliore struttura JSON
        group.to_json(output_file, orient='records', indent=4)
        print(f'Saved {output_file}')
    
    print('Processing completed.')

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python process_and_split_json.py <path_to_csv_file> <fps>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    fps = int(sys.argv[2])
    
    process_and_split_csv(input_file, fps)
