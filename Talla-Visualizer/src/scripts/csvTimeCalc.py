import sys
import pandas as pd

def calculate_collection_time(input_file):
    df = pd.read_csv(input_file)
    
    # Determina quale colonna temporale usare
    if 'abs_time' in df.columns:
        time_column = 'abs_time'
        df[time_column] = pd.to_datetime(df[time_column])
    elif 'time' in df.columns:
        time_column = 'time'
        df[time_column] = df[time_column].astype(float)
    else:
        raise ValueError("Neither 'abs_time' nor 'time' columns are found in the CSV file.")
    
    start_time = df[time_column].min()
    end_time = df[time_column].max()
    
    # Calcola la differenza di tempo
    time_difference = end_time - start_time if time_column == 'abs_time' else pd.to_timedelta(end_time - start_time, unit='s')
    
    return start_time, end_time, time_difference

if __name__ == "__main__":
    input_file = sys.argv[1]
    start_time, end_time, time_difference = calculate_collection_time(input_file)
    
    print(f"Start time: {start_time}")
    print(f"End time: {end_time}")
    print(f"Time difference: {time_difference}")
