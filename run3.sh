### node
python pkl2df.py --input_folder ./staging/stg_e/dj_news/sum/ --output_path ./staging/tmp_t3/news.pkl --extract_column_list source --map_cols '{"source":"node"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t3/entity_1.pkl --extract_column_list "entity 1" --map_cols '{"entity 1":"node"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t3/entity_2.pkl --extract_column_list "entity 2" --map_cols '{"entity 2":"node"}'

### edge
python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t3/entity2entity.pkl --extract_column_list "entity 1" "entity 2" relation --map_cols '{"entity 1":"node1", "entity 2":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t3/news2entity_1.pkl --extract_column_list "entity 1" source --map_cols '{"entity 1":"node1", "source":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t3/news2entity_2.pkl --extract_column_list "entity 2" source --map_cols '{"entity 2":"node1", "source":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/news_sum_sim/ --output_path ./staging/tmp_t3/news2news.pkl --extract_column_list node1 node2 sim --is_value_str 0 #--query_str 'sim > 0.75' 

### get sum
python pkl2df.py --input_folder ./staging/stg_e/dj_news/sum/ --output_path ./staging/tmp_t3/node_attr_summary.pkl  --extract_column_list text source --map_cols '{"text": "summary", "source":"node"}'
### get ner
python pkl2df.py --input_folder ./staging/stg_e/dj_news/ner/ --output_path ./staging/tmp_t3/node_attr_news_ner.pkl  --extract_column_list name tag source --map_cols '{"source":"node"}'
##### get sim
python pkl2df.py --input_folder ./staging/stg_e/dj_news/news_sum_sim/ --output_path ./staging/tmp_t3/edge_attr_news_sim.pkl  --extract_column_list node1 node2 sim

### gen_node_edge.py
### gen node
python gen_node_edge.py --input_path ./staging/tmp_t3/news.pkl --output_path ./staging/tmp_t3/news_v1.pkl --type node --unique_cols node

python gen_node_edge.py --input_path ./staging/tmp_t3/entity_1.pkl ./staging/tmp_t3/entity_2.pkl --output_path ./staging/tmp_t3/entity_v1.pkl --type node --unique_cols node --start_id 21

### gen edge
python gen_node_edge.py --input_path ./staging/tmp_t3/news2entity_1.pkl ./staging/tmp_t3/news2entity_2.pkl  --output_path ./staging/tmp_t3/news2entity_v1.pkl --type edge --unique_cols node1 node2 

python gen_node_edge.py --input_path ./staging/tmp_t3/entity2entity.pkl --output_path ./staging/tmp_t3/entity2entity_v1.pkl --type edge  --unique_cols node1 node2 relation --edge_extract_cols node1 node2 relation edge_type

python gen_node_edge.py --input_path ./staging/tmp_t3/news2news.pkl --output_path ./staging/tmp_t3/news2news_v1.pkl --type edge

### add_nodes_attrs
python add_nodes_attrs.py --input_path ./staging/tmp_t3/news_v1.pkl --add_attr_maps '[{"attr_name":"shape","attr_val":"image"},{"attr_name":"image","attr_val":"news.png"},{"attr_name":"color","attr_val":"#e8792e"}]' --input_attr_path ./staging/tmp_t3/node_attr_summary.pkl --add_cols summary --output_path ./staging/tmp_t3/news_v2.pkl

python add_nodes_attrs.py --input_path ./staging/tmp_t3/news_v2.pkl --input_attr_path ./staging/tmp_t3/node_attr_news_ner.pkl --add_cols name tag --output_path ./staging/tmp_t3/news_v2.pkl --add_mode one-to-many  --integrate_approach list --unique_attr_df 1

python add_nodes_attrs.py --input_path ./staging/tmp_t3/entity_v1.pkl --add_attr_maps '[{"attr_name":"shape","attr_val":"circularImage"},{"attr_name":"image","attr_val":"entity.png"}]' --output_path ./staging/tmp_t3/entity_v2.pkl

python add_nodes_attrs.py --input_path ./staging/tmp_t3/entity_v2.pkl --input_attr_path ./staging/tmp_t3/node_attr_news_ner.pkl --input_attr_map '{"node":"source","name":"node","tag":"entity_tag"}' --merge_on node --add_mode one-to-many --integrate_approach set --add_cols entity_tag --output_path ./staging/tmp_t3/entity_v3.pkl

### add_edges_attrs
python add_edges_attrs.py --input_path ./staging/tmp_t3/entity2entity_v1.pkl --input_attr_path ./staging/tmp_t3/entity2entity_v1.pkl --add_cols relation --output_path ./staging/tmp_t3/entity2entity_v2.pkl

python add_edges_attrs.py --input_path ./staging/tmp_t3/news2entity_v1.pkl --add_attr_maps '[{"attr_name":"relation","attr_val":"has"}]' --output_path ./staging/tmp_t3/news2entity_v2.pkl

python add_edges_attrs.py --input_path ./staging/tmp_t3/news2news_v1.pkl --add_attr_maps '[{"attr_name":"dashes","attr_val":"True"}]' --input_attr_path ./staging/tmp_t3/edge_attr_news_sim.pkl --add_cols sim --output_path ./staging/tmp_t3/news2news_v2.pkl

### gen json dataset
python df2json.py --input_edge_path ./staging/tmp_t3/entity2entity_v2.pkl ./staging/tmp_t3/news2entity_v2.pkl ./staging/tmp_t3/news2news_v2.pkl --input_node_path ./staging/tmp_t3/news_v2.pkl ./staging/tmp_t3/entity_v3.pkl --output_folder ./json3  --whether_use_node_id 0
