
import argparse
import os
import pandas as pd
import re 

def count_node_size(df_row):
    if df_row['df_graph_ind'] == 'after_cut_header':
        word_re = re.compile(r'[0-9A-Za-z\'\’]+')
        df_row['df_graph'][['from_node_size','to_node_size']] = 0
        for index, row in df_row['df_graph'].iterrows():
            if row['c1']:
                c1_num = len(re.findall(word_re,row['c1']))
                df_row['df_graph'].loc[index,'from_node_size'] = c1_num
            if row['c2']:
                c2_num = len(re.findall(word_re,row['c2']))
                df_row['df_graph'].loc[index,'to_node_size'] = c2_num
        df_row['max_node_size'] = df_row['df_graph']['from_node_size'].max() if  df_row['df_graph']['from_node_size'].max() > df_row['df_graph']['to_node_size'].max() else df_row['df_graph']['to_node_size'].max()
        df_row['min_node_size'] = df_row['df_graph']['from_node_size'].min() if df_row['df_graph']['from_node_size'].min() < df_row['df_graph']['to_node_size'].min() else df_row['df_graph']['to_node_size'].min()
    else:
        df_row['max_node_size'] = 0
        df_row['min_node_size'] = 0
    return df_row

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--valid_ratio', type=float, default=0.1)
    parser.add_argument('--train_ratio', type=float, default=0.9)
    parser.add_argument('--input_path', type=str, default='./pkl/preprocessed_df.pkl')
    parser.add_argument('--output_path', type=str, default='./dataset/')
    parser.add_argument('--filter_by_max_node_size', type=int, default=20)
    parser.add_argument('--filter_by_min_node_size', type=int, default=0)

    args = parser.parse_args()

    data = pd.read_pickle(args.input_path)
    print("total sample num: ",data.shape[0])

    data = data.apply(count_node_size, axis=1)

    filter_df = data.query("df_graph_ind=='after_cut_header'").query(f"max_node_size <= {args.filter_by_max_node_size}").query(f"min_node_size >= {args.filter_by_min_node_size}")
    total_num = filter_df.shape[0]
    filter_index = filter_df.index
    print("filter sample num: ",total_num)
    
    total_train_num = int(total_num*args.train_ratio)
    val_num = int(total_train_num*args.valid_ratio)
    val_index = filter_index[:val_num]
    train_index = filter_index[val_num:total_train_num]
    test_index = filter_index[total_train_num:]

    if not os.path.exists(args.output_path):
        os.makedirs(args.output_path)

    print("train_num:",len(data.loc[train_index]))
    train = '\n'.join(data.loc[train_index]['str_newline'])
    with open(f"{args.output_path}train.txt", "w") as file:
        file.write(train)

    print("valid_num:",len(data.loc[val_index]))
    valid = '\n'.join(data.loc[val_index]['str_newline'])
    with open(f"{args.output_path}valid.txt", "w") as file:
        file.write(valid)

    print("test_num:",len(data.loc[test_index]))
    test = '\n'.join(data.loc[test_index]['str_newline'])
    with open(f"{args.output_path}test.txt", "w") as file:
        file.write(test)