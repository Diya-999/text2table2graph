import pandas as pd
import os
import argparse

def pkl2df(file_folder):
    df_ls = []
    for index,filename in enumerate(os.listdir(file_folder)):
        df_tmp = pd.read_pickle(os.path.join(file_folder, filename))
        assert 'json' in df_tmp.columns
        df = pd.DataFrame(df_tmp['json'][0])
        df_ls.append(df)
    df = pd.concat(df_ls).reset_index(drop=True)
    df = df[~df['entity 1'].isnull()]
    df = df[~df['entity 2'].isnull()]
    df = df.reset_index(drop=True)
    df['attr'] =  [{'entity 1':{'shape':'dot'},'entity 2':{'shape':'dot'}}]*df.shape[0]
    return df

def get_news_sum(file_folder):
    sum_dict = {}
    for filename in os.listdir(file_folder):
        df_tmp = pd.read_pickle(os.path.join(file_folder, filename))
        assert 'json' in df_tmp.columns and len(df_tmp['json'][0]) == 1
        tmp_name = filename[:filename.rindex(".")]
        sum_dict[tmp_name] = df_tmp['json'][0][0]['text']
    df = pd.DataFrame({'source':sum_dict.keys(),'summary':sum_dict.values()})
    return df

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_folder', type=str, default='./dj_news/')
    parser.add_argument('--output_path', type=str, default='./df.pkl')
    parser.add_argument('--input_sum_folder', type=str, default='')
    parser.add_argument('--output_sum_path', type=str, default='./df_sum.pkl')

    args = parser.parse_args()

    df = pkl2df(args.input_folder)
    df.to_pickle(args.output_path)

    if args.input_sum_folder:
        df_sum = get_news_sum(args.input_sum_folder)
        df_sum.to_pickle(args.output_sum_path)