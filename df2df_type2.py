import pandas as pd
import argparse

def concat_df(df):
    assert set(df.columns) == set({'entity 1', 'entity 2', 'relation', 'source'})
    df['relation'] = 'has'
    df2 = df.copy()
    df2['entity 2'] = df2['source']
    df['entity 1'] = df['entity 2']
    df['entity 2'] = df['source']

    df_concat = pd.concat([df,df2],axis=0)
    df_concat = df_concat.drop_duplicates(subset=['entity 1','entity 2']).reset_index(drop=True)
    return df_concat

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str, default='./df.pkl')
    parser.add_argument('--output_path', type=str, default='./df_concat.pkl')

    args = parser.parse_args()

    df = pd.read_pickle(args.input_path)
    df_concat = concat_df(df)
    df_concat.to_pickle(args.output_path)