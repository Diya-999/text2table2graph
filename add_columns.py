import pandas as pd
import numpy as np
import re
import argparse
def check_sep_status(text):
    text_lower = text.lower()
    pattern = r'[|][|][\s]?from node[\s]?[|][|][\s]?to node[\s]?[|][|][\s]?edge label[\s]?[|][|][\s]?[|][|]'
    matches = re.findall(pattern, text_lower)
    if len(matches) > 0:
        text = text.replace("||","|")
    return text

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

def build_txt_table(df_row):
    if df_row['df_graph_ind'] == "after_cut_header":
        result_str = '|'
        for row in df_row['df_graph'][['c1','c2','c3']].iterrows():
            for item in row[1]:
                result_str += f" {item} |"
            result_str += " <NEWLINE> |"
        df_row['str_newline'] = result_str[:-12]  #remove last <NEWLINE>
    else:
        df_row['str_newline'] = None
    return df_row  

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str, default='./pkl/final_rs_on_news_2nd_edit.pkl') # or final_rs_on_news
    parser.add_argument('--output_path', type=str, default="./pkl/add_columns_df.pkl")

    args = parser.parse_args()
    data = pd.read_pickle(args.input_path)

    data = data.assign(txt2tab_raw=data['txt2tab_raw'].apply(check_sep_status))

    data['sep_count'] = data['txt2tab_raw'].apply(lambda x: x.count('|'))
    data['sep_count_mod_4'] = (data['sep_count'] % 4 == 0)
    print(data.shape)

    df_4_sep = data.query("sep_count_mod_4 == True")

    df_4_sep = df_4_sep.assign(split_sep=df_4_sep['txt2tab_raw'].apply(lambda x: x.split('|')))
    df_4_sep = df_4_sep.assign(split_sep_count=df_4_sep['split_sep'].apply(lambda x: len(x)))
    df_4_sep = df_4_sep.assign(df_graph=df_4_sep['split_sep'].apply(gen_one_df))
    df_4_sep = df_4_sep.assign(df_graph_ind=df_4_sep['df_graph'].apply(check_header))
    df_4_sep = df_4_sep.apply(cut_normal_header, axis=1)
    df_4_sep = df_4_sep.apply(check_and_rename_empty_node, axis=1)
    df_4_sep = df_4_sep.apply(cut_invalid_header, axis=1)

    df_4_sep = df_4_sep.apply(build_txt_table, axis=1)
    print(df_4_sep.query("df_graph_ind == 'after_cut_header'").shape)

    if data.columns.all() != df_4_sep.columns.all():
        data[['split_sep', 'split_sep_count','has_emtpy_node','df_graph','df_graph_ind','str_newline']] = None
    assert data.columns.all() == df_4_sep.columns.all()
    data.update(df_4_sep)
    data.to_pickle(args.output_path)