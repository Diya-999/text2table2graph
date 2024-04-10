import pandas as pd
import os, json
import argparse

def pkl2df(is_value_str, file_folder, extract_column_list):
    df_ls = []
    for index,filename in enumerate(os.listdir(file_folder)):
        df_tmp = pd.read_pickle(os.path.join(file_folder, filename))
        if is_value_str:
            df_columns = [{k:str(v) for k,v in sample.items() if k in extract_column_list} for sample in df_tmp['json'][0]]
        else:
            df_columns = [{k:v for k,v in sample.items() if k in extract_column_list} for sample in df_tmp['json'][0]]

        df = pd.DataFrame(df_columns)
        df_ls.append(df)
    df = pd.concat(df_ls).reset_index(drop=True)
    df = df.reset_index(drop=True)
    return df

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_folder', type=str, default='./dj_news/')
    parser.add_argument('--extract_column_list', type=str, nargs='+', default=[])
    parser.add_argument('--output_path', type=str, default='./df.pkl')
    parser.add_argument('--map_cols', type=str, default='')
    parser.add_argument('--query_str', type=str, default='')
    parser.add_argument('--is_value_str', type=int, default=1)
    
    args = parser.parse_args()

    df = pkl2df(args.is_value_str, args.input_folder, args.extract_column_list)
    if args.map_cols:
        columns = json.loads(args.map_cols)
        df = df.rename(columns=columns)

    if args.query_str:
        df = df.query(args.query_str).reset_index(drop=True)
    dir_path = os.path.dirname(args.output_path)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    df.to_pickle(args.output_path)