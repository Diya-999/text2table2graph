import pandas as pd
import argparse
import json

def update_attr(attr, add_attr):
    attr.update(add_attr)
    return attr
    
def add_attr(row, new_attr_list):
    for attr in new_attr_list:
        row['attr'][attr] = row[attr]
    return row['attr']

def to_list(series):
    return list(series)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str,  default='./news_v1.pkl')
    parser.add_argument('--add_attr_maps', type=str,  default='')
    parser.add_argument('--input_attr_path', type=str,  default='')
    parser.add_argument('--add_cols', type=str, nargs='+', default=[])
    parser.add_argument('--add_mode', type=str, default='one-to-one')  #one-to-many or one-to-one
    parser.add_argument('--unique_attr_df', type=str, default=0) 
    parser.add_argument('--output_path', type=str, default='./news_v2.pkl')

    args = parser.parse_args()
    df = pd.read_pickle(args.input_path)
    if 'attr' not in df.columns:
        df['attr'] = [{} for _ in range(df.shape[0])]

    if args.add_attr_maps:
        attr_maps = json.loads(args.add_attr_maps)
        attr_dict = {}
        for each_attr in attr_maps:
            attr_dict[each_attr['attr_name']] = each_attr['attr_val']
        
        df['attr'] = df['attr'].apply(update_attr, args=(attr_dict,))

    if args.input_attr_path:
        df_attr = pd.read_pickle(args.input_attr_path)
        if args.add_cols != []:
            add_cols = args.add_cols
            df_attr = df_attr[args.add_cols+['node']]
        else:
            add_cols = list(df_attr.columns) - ['node']

        if args.unique_attr_df:
            df_attr = df_attr.drop_duplicates().reset_index(drop=True)

        if args.add_mode == 'one-to-many':
            agg_method = {col_name: to_list for col_name in add_cols}
            df_attr = df_attr.groupby('node').agg(agg_method)

        merge_df = df.merge(df_attr, on='node', how='left')
        df['attr'] = merge_df.apply(add_attr, args=(add_cols,), axis=1)

    if args.add_attr_maps or args.input_attr_path:
        df.to_pickle(args.output_path)
    else:
        print("You should input add_attr_maps or input_attr_path")