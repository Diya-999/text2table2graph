import pandas as pd
import numpy as np
import argparse

def gen_sim(config):
    data = pd.read_pickle(config.input_path)
    data['node1_source'] = data['news_pair'].apply(lambda x: x[0])
    data['node2_source'] = data['news_pair'].apply(lambda x: x[1])

    news2news_extract_column_list = ['node1_source', 'node2_source','news2news_sim']

    df_news2news = data[news2news_extract_column_list].rename(columns={'node1_source':'node1','node2_source':'node2','news2news_sim':'sim'})
    df_news2news.to_pickle(config.news2news_output_path)

    data['ner2ner_list'] = data['df_ner2ner_2'].apply(lambda x: x.stack().reset_index().values.tolist())
    data = data.explode('ner2ner_list')
    data.reset_index(inplace=True,drop=True)
    data['node1'] = data['ner2ner_list'].apply(lambda x: x[0])
    data['node2'] = data['ner2ner_list'].apply(lambda x: x[1])
    data['sim'] = data['ner2ner_list'].apply(lambda x: x[2])

    entity2entity_extract_column_list = ['node1','node1_source', 'node2','node2_source','sim','news2news_sim']
    data[entity2entity_extract_column_list].to_pickle(config.entity2entity_output_path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument("--input_path", type=str, default="./staging/stg_e/dj_news/ner2ner_sim/news2new_en2en_sim.pkl")
    parser.add_argument("--entity2entity_output_path", type=str, default="./staging/tmp_t/entity2entity_sim.pk")
    parser.add_argument("--news2news_output_path", type=str, default="./staging/tmp_t/news2news_sim.pk")
    args = parser.parse_args()

    gen_sim(args)