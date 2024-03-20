import pandas as pd
import os
import argparse

def pkl2df(file_folder):
    df_ls = []
    for index,filename in enumerate(os.listdir(file_folder)):
        df_tmp = pd.read_pickle(os.path.join(file_folder, filename))
        if set(df_tmp.columns) == set({'entity 1', 'entity 2', 'relation', 'source'}):
            df_ls.append(df_tmp)
    df = pd.concat(df_ls).reset_index(drop=True)
    df = df[~df['entity 1'].isnull()]
    df = df[~df['entity 2'].isnull()]
    df = df.reset_index(drop=True)
    return df

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_folder', type=str, default='./dj_news/')
    parser.add_argument('--output_path', type=str, default='./df.pkl')

    args = parser.parse_args()

    df = pkl2df(args.input_folder)
    df.to_pickle(args.output_path)