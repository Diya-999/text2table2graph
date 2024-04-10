import pandas as pd
import numpy as np
import argparse

def gen_entity_sim(config):
    news2entity = pd.read_pickle(config.news2entity_path)
    news2news = pd.read_pickle(config.news2news_path)

    entity2entity_sim = pd.DataFrame(columns=['node1','node1_source', 'node2','node2_source','sim'])
    for index, row in news2news.iterrows():
        entity1 = news2entity[news2entity['node2'] == row['node1']][['node1','node2']]
        entity1.rename(columns={'node2':'node1_source'},inplace=True)
        entity2 = news2entity[news2entity['node2'] == row['node2']][['node1','node2']]
        entity2.rename(columns={'node1':'node2','node2':'node2_source'},inplace=True)

        pairs = ((x['node1'],x['node1_source'],y['node2'], y['node2_source']) for _, x in entity1.iterrows() for _,y in entity2.iterrows())
        tmp = pd.DataFrame(pairs, columns=['node1','node1_source', 'node2','node2_source'])
        tmp['sim'] = [np.random.rand(1)[0] for _ in range(tmp.shape[0])]
        entity2entity_sim = pd.concat([entity2entity_sim,tmp], ignore_index=True)

    entity2entity_sim.to_pickle(config.output_path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('--news2entity_path', type=str, default="./staging/tmp_t3/news2entity_v1.pkl")
    parser.add_argument('--news2news_path', type=str, default='./staging/tmp_t3/news2news_v1.pkl')

    parser.add_argument('--output_path', type=str, default='./staging/tmp_t3/entity2entity_sim.pkl')

    args = parser.parse_args()

    gen_entity_sim(args)

# python gen_entity2entity_sim.py --news2entity_path ./staging/tmp_t3/news2entity_v1.pkl --news2news_path ./staging/tmp_t3/news2news_v1.pkl --output_path ./staging/tmp_t3/entity2entity_sim.pkl
