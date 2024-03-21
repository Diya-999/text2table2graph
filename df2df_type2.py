import pandas as pd
import argparse

def concat_df(df, df_sum):
    assert set(df.columns) == set({'entity 1', 'entity 2', 'relation', 'source','attr'})
    df['relation'] = 'has'
    df2 = df.copy()
    df2['entity 2'] = df2['source']
    df['entity 1'] = df['entity 2']
    df['entity 2'] = df['source']

    df_concat = pd.concat([df,df2],axis=0)
    df_concat = df_concat.drop_duplicates(subset=['entity 1','entity 2'])
    df_concat['attr'] =  [{'entity 1':{'shape':'dot'},'entity 2':{'shape':'triangle'}} for _ in range(df_concat.shape[0])]
    df_concat = df_concat.reset_index(drop=True)
    for index, row in df_concat.iterrows():
        source_name = row['entity 2'].split('/')[-1]
        source_name = source_name[:source_name.rindex(".")]
        sum_ind = df_sum.query(f'source == "{source_name}"').index
        assert len(sum_ind) == 1
        df_concat.iloc[index]['attr']['entity 2']['summary'] = df_sum['summary'][sum_ind[0]]
    return df_concat

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str, default='./df.pkl')
    parser.add_argument('--output_path', type=str, default='./df_concat.pkl')
    parser.add_argument('--input_sum_path', type=str, default='./df_sum.pkl')

    args = parser.parse_args()

    df = pd.read_pickle(args.input_path)
    df_sum = pd.read_pickle(args.input_sum_path)
    df_concat = concat_df(df, df_sum)
    df_concat.to_pickle(args.output_path)