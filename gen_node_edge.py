import pandas as pd
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str, nargs="+", default=['./df.pkl'])
    parser.add_argument('--output_path', type=str, default='./df_concat.pkl')
    parser.add_argument('--type', type=str, default='node')
    parser.add_argument('--start_id', type=int, default=0, help="set id for nodes by order")
    parser.add_argument('--input_node1_path', type=str, default='') 
    parser.add_argument('--input_node1_merge_cols', type=str, nargs="+", default=[])
    parser.add_argument('--input_node2_path', type=str, default='') 
    parser.add_argument('--input_node2_merge_cols', type=str, nargs="+", default=[])

    parser.add_argument('--input_df_node1_merge_cols', type=str, nargs="+", default=[])
    parser.add_argument('--input_df_node2_merge_cols', type=str, nargs="+", default=[])

    parser.add_argument('--unique_cols', type=str, nargs="+", default=[])
    parser.add_argument('--edge_extract_cols', type=str, nargs="+", default=['node1','node2','node1_id','node2_id','edge_type','source','relation'])
    parser.add_argument('--node_extract_cols', type=str, nargs="+", default=['node','node_type','id','source'])

    args = parser.parse_args()

    if args.input_node1_path and args.input_node2_path:
        df_node1 = pd.read_pickle(args.input_node1_path)
        df_node1 = df_node1[args.input_node1_merge_cols+['id']]
        df_node1.rename(columns={'id':'node1_id'},inplace=True)

        df_node2 = pd.read_pickle(args.input_node2_path)
        df_node2 = df_node2[args.input_node2_merge_cols+['id']]
        df_node2.rename(columns={'id':'node2_id'},inplace=True)
    
    if args.type == 'edge':
        extract_cols = args.edge_extract_cols
    elif args.type == 'node':
        extract_cols = args.node_extract_cols
    else:
        print("config 'type' should be 'edge' or 'node'")

    df_list = []
    for path in args.input_path:
        print("path",path)
        tmp = pd.read_pickle(path)
        type_name = path[path.rindex('/')+1:]
        type_name = type_name[:type_name.rindex('.')]
        if '_' in type_name:
            type_name = type_name[:type_name.rindex('_')]            
        print(f"{args.type}_type = ", type_name)
        tmp[f"{args.type}_type"] = type_name
        df_list.append(tmp)

    df = pd.concat(df_list,axis=0).reset_index(drop=True)

    if args.type == 'edge' and args.input_node1_path:
        df = df.merge(df_node1, left_on=args.input_df_node1_merge_cols, right_on=args.input_node1_merge_cols, how='left')
        df = df.merge(df_node2, left_on=args.input_df_node2_merge_cols, right_on=args.input_node2_merge_cols, how='left')

    for col in df.columns:
        if col not in extract_cols:
            df.drop(columns=[col],inplace=True)
    if args.unique_cols:
        df = df.drop_duplicates(subset=args.unique_cols).reset_index(drop=True)

    if args.type == 'node' and 'id' not in df.columns:
        df['id'] = [id for id in range(args.start_id, args.start_id+df.shape[0] )]
        print('new node start id shoud be: ',args.start_id+df.shape[0])

    df.to_pickle(args.output_path)