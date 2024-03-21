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

def build_network(df):
    got_net = Network(height="600px", width="40%", select_menu=True, filter_menu=True, directed=True)

    node1 = df['entity 1']
    node2 = df['entity 2']
    relation = df['relation']
    source = df['source']
    attr = df['attr']
    edge_data = zip(node1, node2, relation,source, attr)
    for e in edge_data:
        n1 = add_newline(str(e[0]))
        n2 = e[1]
        r = add_newline(str(e[2]))
        s = str(e[3])
        a = e[4]
        if 'summary' in a['entity 2']:  
            n2 = add_newline(str(n2),'/',2)
            r = a['entity 2']['summary']
        else:
            n2 = add_newline(str(n2))
            
        got_net.add_node(n1, n1, title=n1,size=16, shape=a['entity 1']['shape'])
        got_net.add_node(n2, n2, title=n2,size=16, shape=a['entity 2']['shape'])
        got_net.add_edge(n1, n2, arrows={"to": {"enabled": False}}, relation=r,news_source=s)
    return got_net

def save_network2json(net,output_folder):
    for node_dict in net.nodes:
        if 'value' in node_dict:
            del node_dict['value']
    nodes_json = json.dumps(net.nodes)
    edges_json = json.dumps(net.edges)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(f'{output_folder}/nodes.json', 'w') as nodes_file:
        # nodes_file.write(nodes_json)
        nodes_file.write(f"nodes = new vis.DataSet("+nodes_json+');')

    with open(f'{output_folder}/edges.json', 'w') as edges_file:
        # edges_file.write(edges_json)
        edges_file.write(f"edges = new vis.DataSet("+edges_json+');')
     

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--input_path', type=str, nargs='+', default=['./df.pkl'])
    parser.add_argument('--output_folder', type=str, default='./json')

    args = parser.parse_args()

    df_list = []
    for path in args.input_path:
        tmp = pd.read_pickle(path)
        df_list.append(tmp)
    df = pd.concat(df_list,axis=0)

    if set(df.columns) == set({'entity 1', 'entity 2', 'relation', 'source','attr'}):
        network = build_network(df)
        save_network2json(network, args.output_folder)

    else:
        raise NotImplementedError(
                f"Unsupport dataframe column name as {df.columns} "
            )





