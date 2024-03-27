import pandas as pd
from pyvis.network import Network
import json
import os
import argparse

def add_newline(s, split_sign=' ', word_index=3):
    split_s = s.split(split_sign)
    if word_index >= len(split_s):
        return s
    for i in range(word_index, len(split_s), word_index):
        split_s[i-1] += '\n'
    new_string = split_sign.join(split_s)
    return new_string

def build_network(node_df, edge_df):
    got_net = Network(height="600px", width="40%", select_menu=True, filter_menu=True, directed=True)
    for index, row in node_df.iterrows():
        if args.whether_use_node_id:
            id = row['id']
        else:
            id = row['node']
        if row['node_type'] == 'news':
            label = add_newline(str(row['node']),'/',2)
            got_net.add_node(id, label=label, node_type=row['node_type'], title=row['node'],size=16, **row['attr'])

        elif row['node_type'] == 'entity':
            label = add_newline(str(row['node']))
            got_net.add_node(id, label=label, node_type=row['node_type'], title=row['node'],size=16, **row['attr'])

    for index, row in edge_df.iterrows():
        if args.whether_use_node_id:
            inode1_id = row['node1_id']
            inode2_id = row['node2_id']
        else:
            inode1_id = row['node1']
            inode2_id = row['node2']
        if 'attr' in row.keys() and type(row['attr']) == dict:
            got_net.add_edge(inode1_id, inode2_id, edge_type=row['edge_type'], arrows={"to": {"enabled": False}}, **row['attr'])
        else:
            got_net.add_edge(inode1_id, inode2_id, edge_type=row['edge_type'], arrows={"to": {"enabled": False}})
    return got_net

def save_network2json(net,output_folder):
    for node_dict in net.nodes:
        if 'value' in node_dict:
            del node_dict['value']
    for edge_dict in net.edges:
        if 'dashes' in edge_dict and edge_dict['dashes'] == 'True':
            edge_dict['dashes'] = True

    nodes_json = json.dumps(net.nodes)
    edges_json = json.dumps(net.edges)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(f'{output_folder}/nodes.json', 'w') as nodes_file:
        nodes_file.write(f"nodes = new vis.DataSet("+nodes_json+');')

    with open(f'{output_folder}/edges.json', 'w') as edges_file:
        edges_file.write(f"edges = new vis.DataSet("+edges_json+');')
     

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_node_path', type=str, nargs='+', default=['./news.pkl'])
    parser.add_argument('--input_edge_path', type=str, nargs='+', default=['./news2entity.pkl'])
    parser.add_argument('--whether_use_node_id', type=int, default=0)
    parser.add_argument('--output_folder', type=str, default='./json')

    args = parser.parse_args()

    edge_df_list = []
    for path in args.input_edge_path:
        tmp = pd.read_pickle(path)
        edge_df_list.append(tmp)
    edge_df = pd.concat(edge_df_list,axis=0)

    node_df_list = []
    for path in args.input_node_path:
        tmp = pd.read_pickle(path)
        node_df_list.append(tmp)
    node_df = pd.concat(node_df_list,axis=0)

    network = build_network(node_df, edge_df)
    save_network2json(network, args.output_folder)


