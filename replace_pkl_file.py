import pandas as pd
import os
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_new_data_path', type=str, default='./pkl/final_rs_on_news_new.pkl')
    parser.add_argument('--input_old_data_path', type=str, default='./pkl/final_rs_on_news.pkl')
    parser.add_argument('--output_path', type=str, default='./pkl/final_rs_on_news.pkl')

    args = parser.parse_args()
    new_data = pd.read_pickle(args.input_new_data_path)
    old_data = pd.read_pickle(args.input_old_data_path)
    assert 'txt2tab_raw' in list(new_data.columns) and 'text' in list(new_data.columns) 
    assert 'txt2tab_raw' in list(old_data.columns) and 'text' in list(old_data.columns) and 'is_2nd_edit' in list(old_data.columns) 
    old_len = old_data.shape[0]
    print("old_data.shape",old_data.shape)
    print("new_data.shape",new_data.shape)
    assert sum(new_data['text'][:old_len].ne(old_data['text'])) == 0
    assert sum(new_data['txt2tab_raw'][:old_len].ne(old_data['txt2tab_raw'])) == 0
    new_data['is_2nd_edit'] = 0

    new_data.update(old_data)

    assert sum(new_data['is_2nd_edit'].ne(old_data['is_2nd_edit'])) == 0
    new_data.to_pickle(args.output_path)