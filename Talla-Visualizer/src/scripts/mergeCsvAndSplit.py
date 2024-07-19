import pandas as pd
import os
import json
import argparse

def merge_csv_files(input_files, base_dir, output_dir):
    """Unisce più file CSV in un unico file CSV."""
    merged_df = pd.concat([pd.read_csv(os.path.join(base_dir, file)) for file in input_files])
    
    sub_dir = os.path.join(base_dir, output_dir)
    
    if not os.path.exists(sub_dir):
        os.makedirs(sub_dir)
    
    merged_output_file = os.path.join(sub_dir, 'merged.csv')
    merged_df.to_csv(merged_output_file, index=False)
    print(f'Merged file saved as {merged_output_file}')
    return merged_output_file, sub_dir

def split_csv_by_frame(input_file, output_dir, frames_per_file):
    """Divide un file CSV in base al range di frame."""
    df = pd.read_csv(input_file)
    min_frame = df['frame'].min()
    max_frame = df['frame'].max()

    index_data = []

    for start_frame in range(min_frame, max_frame + 1, frames_per_file):
        end_frame = min(start_frame + frames_per_file - 1, max_frame)
        subset_df = df[(df['frame'] >= start_frame) & (df['frame'] <= end_frame)]
        output_file = os.path.join(output_dir, f'frames_{start_frame}_{end_frame}.csv')
        subset_df.to_csv(output_file, index=False)
        index_data.append({
            'start_frame': int(start_frame), 
            'end_frame': int(end_frame), 
            'file': output_file
        })

    index_file = os.path.join(output_dir, 'index.json')
    with open(index_file, 'w') as f:
        json.dump(index_data, f, indent=4)
    print(f"Index saved at {index_file}")

    # Elimina il file unito originale
    os.remove(input_file)
    print(f"Removed merged file {input_file}")

    return index_file

def main():
    parser = argparse.ArgumentParser(description='Merge and split CSV files.')
    parser.add_argument('--input_files', nargs='+', required=True, help='List of input CSV files')
    parser.add_argument('--base_dir', required=True, help='Base directory containing the input CSV files')
    parser.add_argument('--output_dir', required=True, help='Directory to save the output files')
    parser.add_argument('--frames_per_file', type=int, required=True, help='Number of frames per output file')
    
    args = parser.parse_args()
    dir=os.path.join(args.base_dir, args.output_dir)
    if not os.path.exists(dir):
        # Unisci i file CSV
        merged_file, output_sub_dir = merge_csv_files(args.input_files, args.base_dir, args.output_dir)
        # Dividi il file unito in base al range di frame ed elimina il file unito
        split_csv_by_frame(merged_file, output_sub_dir, args.frames_per_file)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}")
