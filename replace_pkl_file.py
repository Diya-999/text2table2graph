import pandas as pd
import os

if __name__ == '__main__':
    new_data_path = "./pkl/final_rs_on_news_new.pkl"
    old_data = pd.read_pickle("./pkl/final_rs_on_news.pkl")
    new_data = pd.read_pickle(new_data_path)
    old_len = old_data.shape[0]
    print("old_data.shape",old_data.shape)
    print("new_data.shape",new_data.shape)
    assert sum(new_data['text'][:old_len].ne(old_data['text'])) == 0
    assert sum(new_data['txt2tab_raw'][:old_len].ne(old_data['txt2tab_raw'])) == sum(old_data['is_2nd_edit'])
    new_data['is_2nd_edit'] = 0

    new_data.update(old_data)

    assert sum(new_data['is_2nd_edit'][:old_len].ne(old_data['is_2nd_edit'])) == 0
    new_data.to_pickle('./pkl/final_rs_on_news.pkl')
    os.remove(new_data_path)