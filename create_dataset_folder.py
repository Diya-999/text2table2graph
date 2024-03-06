
import argparse
import os
import pandas as pd
import numpy as np
import re 

def gen_one_df(row):
    tmp_arr = np.array(row[1:])
    tmp_arr = [x.strip() for x in tmp_arr]
    return pd.DataFrame({
        'c1':tmp_arr[0::4],    
        'c2':tmp_arr[1::4],
        'c3':tmp_arr[2::4],
    })

def check_header(df):
    if df.shape[0] > 2:
        row0 = df.iloc[0]
        row1 = df.iloc[1]
    else:
        return 'lt_2_rows'
    
    if row0['c1'].strip().lower()!='from node' or row0['c2'].strip().lower()!='to node' or row0['c3'].strip().lower()!='edge label':
        return 'first_row_error'
    elif set(''.join(row1)) != set('-'):
        return 'second_row_error'
    else:
        return 'can_cut_header'

def cut_normal_header(df_row):
    if df_row['df_graph_ind'] == 'can_cut_header':
        df_row['df_graph'] = df_row['df_graph'][2:]
        df_row['df_graph'].reset_index(drop=True, inplace=True)
        df_row['df_graph_ind'] = 'after_cut_header'
    return df_row     

def check_and_rename_empty_node(df_row):
    my_re = re.compile(r'[A-Za-z0-9]')
    df = df_row['df_graph']
    has_empty_node = False
    for row in df.iterrows():
        if row[1]['c1'] is None or re.findall(my_re,row[1]['c1']) == []:
            df.iloc[row[0]]['c1'] = None
            has_empty_node = True
        if row[1]['c2'] is None or re.findall(my_re,row[1]['c2']) == []:
            df.iloc[row[0]]['c2'] = None
            has_empty_node = True
    df_row['has_emtpy_node'] = has_empty_node
    return df_row

def cut_invalid_header(df_row):
    if df_row['df_graph_ind'] not in ["after_cut_header","lt_2_rows"]:
        if "to node" in df_row['df_graph']['c1'].values[0].lower() and "edge label" in df_row['df_graph']['c2'].values[0].lower():
            df_row['df_graph'] = df_row['df_graph'][1:]
            df_row['df_graph'].reset_index(drop=True, inplace=True)
            df_row['df_graph_ind'] = 'after_cut_header'
    return df_row  

def find_max_node_size(df_row):
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
    return df_row

def build_txt_table(df_row):
    if df_row['df_graph_ind'] == "after_cut_header":
        result_str = '|'
        for row in df_row['df_graph'].iterrows():
            for item in row[1]:
                result_str += f" {item} |"
            result_str += " <NEWLINE> |"
        df_row['str_newline'] = result_str[:-12]  #remove last <NEWLINE>
    else:
        df_row['str_newline'] = None
    return df_row  

parser = argparse.ArgumentParser()

parser.add_argument('--valid_ratio', type=float, default=0.1)
parser.add_argument('--train_ratio', type=float, default=0.9)
parser.add_argument('--input_path', type=str, default='./pkl/final_rs_on_news_v2.pkl')
parser.add_argument('--output_path', type=str, default='./dataset/')
parser.add_argument('--filter_by_max_node_size', type=int, default=20)
parser.add_argument('--filter_by_min_node_size', type=int, default=0)

args = parser.parse_args()

data = pd.read_pickle(args.input_path)

data['sep_count'] = data['txt2tab_raw'].apply(lambda x: x.count('|'))
data['sep_count_mod_4'] = (data['sep_count'] % 4 == 0)
df_4_sep = data.query("sep_count_mod_4 == True")#.assign(has_emtpy_node=False)

df_4_sep = df_4_sep.assign(split_sep=df_4_sep['txt2tab_raw'].apply(lambda x: x.split('|')))
df_4_sep = df_4_sep.assign(split_sep_count=df_4_sep['split_sep'].apply(lambda x: len(x)))
df_4_sep = df_4_sep.assign(df_graph=df_4_sep['split_sep'].apply(gen_one_df))
df_4_sep = df_4_sep.assign(df_graph_ind=df_4_sep['df_graph'].apply(check_header))
df_4_sep = df_4_sep.apply(cut_normal_header, axis=1)
df_4_sep = df_4_sep.apply(check_and_rename_empty_node, axis=1)
df_4_sep = df_4_sep.apply(cut_invalid_header, axis=1)
df_4_sep = df_4_sep.apply(find_max_node_size, axis=1)

df_4_sep = df_4_sep.apply(build_txt_table, axis=1)

total_num = df_4_sep.query("df_graph_ind=='after_cut_header'").shape[0]
total_train_num = int(total_num*args.train_ratio)
val_num = int(total_train_num*args.valid_ratio)
filter_index = df_4_sep.query("df_graph_ind=='after_cut_header'").query(f"max_node_size <= {args.filter_by_max_node_size}").query(f"min_node_size >= {args.filter_by_min_node_size}").index
val_index = filter_index[:val_num]
train_index = filter_index[val_num:total_train_num]
test_index = filter_index[total_train_num:]

if not os.path.exists(args.output_path):
    os.makedirs(args.output_path)

train = '\n'.join(df_4_sep.loc[train_index]['str_newline'])
with open(f"{args.output_path}train.txt", "w") as file:
    file.write(train)

valid = '\n'.join(df_4_sep.loc[val_index]['str_newline'])
with open(f"{args.output_path}valid.txt", "w") as file:
    file.write(valid)

test = '\n'.join(df_4_sep.loc[test_index]['str_newline'])
with open(f"{args.output_path}test.txt", "w") as file:
    file.write(test)