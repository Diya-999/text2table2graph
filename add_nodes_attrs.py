import pandas as pd
import argparse
import json

def update_attr(attr, add_attr):
    attr.update(add_attr)
    return attr
    
def add_attr(row, new_attr_list, is_attr_str):
    for attr in new_attr_list:
        if is_attr_str:
            row['attr'][attr] = str(row[attr])
        else:
            row['attr'][attr] = row[attr]
    return row['attr']

def to_list(series):
    return "; ".join(list(series))
    
def to_set(series):
    return "; ".join(set(series))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str,  default='./news_v1.pkl')
    parser.add_argument('--add_attr_maps', type=str,  default='')
    parser.add_argument('--input_attr_path', type=str,  default='')
    parser.add_argument('--input_attr_map', type=str,  default='', help="Dictionary used to rename column names")
    parser.add_argument('--merge_on', type=str,  nargs='+', default=['node'], help="Merge the column names used by df and df_attr")
    parser.add_argument('--is_attr_str', type=int, default=1, help="Whether convert attr to str type")
    parser.add_argument('--add_cols', type=str, nargs='+', default=[])
    parser.add_argument('--add_mode', type=str, default='one-to-one', help="one-to-many; one-to-one") 
    parser.add_argument('--integrate_approach', type=str, default='list', help="list; set") 
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
        if args.input_attr_map:
            input_attr_map = json.loads(args.input_attr_map)
            df_attr.rename(columns=input_attr_map,inplace=True)

        if args.add_cols != []:
            add_cols = args.add_cols
            df_attr = df_attr[args.add_cols+args.merge_on]
        else:
            add_cols = list(df_attr.columns) - args.merge_on

        if args.unique_attr_df:
            df_attr = df_attr.drop_duplicates().reset_index(drop=True)

        if args.add_mode == 'one-to-many':
            if args.integrate_approach == 'list':
                agg_method = {col_name: to_list for col_name in add_cols}
            elif args.integrate_approach == 'set':
                agg_method = {col_name: to_set for col_name in add_cols}
            df_attr = df_attr.groupby(args.merge_on).agg(agg_method)

        df = df.merge(df_attr, on=args.merge_on, how='left')
        df['attr'] = df.apply(add_attr, args=(add_cols,args.is_attr_str,), axis=1)
        df.drop(columns=add_cols, inplace=True)
    if args.add_attr_maps or args.input_attr_path:
        df.to_pickle(args.output_path)
    else:
        print("You should input add_attr_maps or input_attr_path")