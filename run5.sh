### node
python pkl2df.py --input_folder ./staging/stg_e/dj_news/sum/ --output_path ./staging/tmp_t5/news.pkl --extract_column_list source --map_cols '{"source":"node"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t5/entity_1.pkl --extract_column_list "entity 1" source --map_cols '{"entity 1":"node"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t5/entity_2.pkl --extract_column_list "entity 2" source --map_cols '{"entity 2":"node"}'

### edge
python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t5/entity2entity.pkl --extract_column_list "entity 1" "entity 2" relation source --map_cols '{"entity 1":"node1", "entity 2":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t5/news2entity_1.pkl --extract_column_list "entity 1" source --map_cols '{"entity 1":"node1", "source":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t5/news2entity_2.pkl --extract_column_list "entity 2" source --map_cols '{"entity 2":"node1", "source":"node2"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/news_sum_sim/ --output_path ./staging/tmp_t5/news2news.pkl --extract_column_list node1 node2 sim --is_value_str 0 #--query_str 'sim > 0.75'

### get sum
python pkl2df.py --input_folder ./staging/stg_e/dj_news/sum/ --output_path ./staging/tmp_t5/node_attr_summary.pkl  --extract_column_list text source --map_cols '{"text": "summary", "source":"node"}'
### get ner
python pkl2df.py --input_folder ./staging/stg_e/dj_news/ner/ --output_path ./staging/tmp_t5/node_attr_news_ner.pkl  --extract_column_list name tag source --map_cols '{"source":"node"}'
##### get sim
python pkl2df.py --input_folder ./staging/stg_e/dj_news/news_sum_sim/ --output_path ./staging/tmp_t5/edge_attr_news_sim.pkl  --extract_column_list node1 node2 sim

### gen_node_edge.py
### gen node
python gen_node_edge.py --input_path ./staging/tmp_t5/news.pkl --output_path ./staging/tmp_t5/news_v1.pkl --type node --unique_cols node

python gen_node_edge.py --input_path ./staging/tmp_t5/entity_1.pkl ./staging/tmp_t5/entity_2.pkl --output_path ./staging/tmp_t5/entity_v1.pkl --type node --unique_cols node source --start_id 21

### gen edge
python gen_node_edge.py --input_path ./staging/tmp_t5/news2entity_1.pkl ./staging/tmp_t5/news2entity_2.pkl  --output_path ./staging/tmp_t5/news2entity_v1_with_id.pkl --type edge --unique_cols node1_id node2_id --input_node1_path ./staging/tmp_t5/entity_v1.pkl --input_node1_merge_cols node source --input_df_node1_merge_cols node1 node2 --input_node2_path ./staging/tmp_t5/news_v1.pkl  --input_node2_merge_cols node --input_df_node2_merge_cols node2

python gen_node_edge.py --input_path ./staging/tmp_t5/entity2entity.pkl --output_path ./staging/tmp_t5/entity2entity_v1_with_id.pkl --type edge  --unique_cols node1_id node2_id --input_node1_path ./staging/tmp_t5/entity_v1.pkl --input_node1_merge_cols node source --input_df_node1_merge_cols node1 source --input_node2_path ./staging/tmp_t5/entity_v1.pkl  --input_node2_merge_cols node source  --input_df_node2_merge_cols node2 source

python gen_node_edge.py --input_path ./staging/tmp_t5/news2news.pkl --output_path ./staging/tmp_t5/news2news_v1_with_id.pkl --type edge --input_node1_path ./staging/tmp_t5/news_v1.pkl --input_node1_merge_cols node --input_df_node1_merge_cols node1 --input_node2_path ./staging/tmp_t5/news_v1.pkl  --input_node2_merge_cols node --input_df_node2_merge_cols node2

python gen_entity2entity_sim.py --news2entity_path ./staging/tmp_t5/news2entity_v1_with_id.pkl --news2news_path ./staging/tmp_t5/news2news_v1_with_id.pkl --output_path ./staging/tmp_t5/entity2entity_sim.pkl

python gen_node_edge.py --input_path ./staging/tmp_t5/entity2entity_sim.pkl --output_path ./staging/tmp_t5/entity2entity_sim_v1.pkl --type edge --edge_extract_cols node1 node2 sim edge_type node1_id node2_id --input_node1_path ./staging/tmp_t5/entity_v1.pkl --input_node1_merge_cols node source --input_df_node1_merge_cols node1 node1_source --input_node2_path ./staging/tmp_t5/entity_v1.pkl  --input_node2_merge_cols node source  --input_df_node2_merge_cols node2 node2_source

### add_nodes_attrs
python add_nodes_attrs.py --input_path ./staging/tmp_t5/news_v1.pkl --add_attr_maps '[{"attr_name":"shape","attr_val":"image"},{"attr_name":"image","attr_val":"news.png"},{"attr_name":"color","attr_val":"#e8792e"}]' --input_attr_path ./staging/tmp_t5/node_attr_summary.pkl --add_cols summary --output_path ./staging/tmp_t5/news_v2.pkl

python add_nodes_attrs.py --input_path ./staging/tmp_t5/news_v2.pkl --input_attr_path ./staging/tmp_t5/node_attr_news_ner.pkl --add_cols name tag --output_path ./staging/tmp_t5/news_v2.pkl --add_mode one-to-many --unique_attr_df 1

python add_nodes_attrs.py --input_path ./staging/tmp_t5/entity_v1.pkl --add_attr_maps '[{"attr_name":"shape","attr_val":"circularImage"},{"attr_name":"image","attr_val":"entity.png"}]' --output_path ./staging/tmp_t5/entity_v2.pkl

### add_edges_attrs
python add_edges_attrs.py --input_path ./staging/tmp_t5/entity2entity_v1_with_id.pkl --input_attr_path ./staging/tmp_t5/entity2entity_v1_with_id.pkl --add_cols relation --output_path ./staging/tmp_t5/entity2entity_v2.pkl

python add_edges_attrs.py --input_path ./staging/tmp_t5/news2entity_v1_with_id.pkl --add_attr_maps '[{"attr_name":"relation","attr_val":"has"}]' --output_path ./staging/tmp_t5/news2entity_v2.pkl

python add_edges_attrs.py --input_path ./staging/tmp_t5/news2news_v1_with_id.pkl --add_attr_maps '[{"attr_name":"dashes","attr_val":"True"}]' --input_attr_path ./staging/tmp_t5/edge_attr_news_sim.pkl --add_cols sim --output_path ./staging/tmp_t5/news2news_v2.pkl

python add_edges_attrs.py --input_path ./staging/tmp_t5/entity2entity_sim_v1.pkl --input_attr_path ./staging/tmp_t5/entity2entity_sim_v1.pkl  --add_attr_maps '[{"attr_name":"color","attr_val":"#49bf6c"},{"attr_name":"dashes","attr_val":"True"}]' --add_cols sim --output_path ./staging/tmp_t5/entity2entity_sim_v2.pkl

### gen json dataset
python df2json.py --input_edge_path ./staging/tmp_t5/entity2entity_v2.pkl ./staging/tmp_t5/news2entity_v2.pkl ./staging/tmp_t5/news2news_v2.pkl ./staging/tmp_t5/entity2entity_sim_v2.pkl --input_node_path ./staging/tmp_t5/news_v2.pkl ./staging/tmp_t5/entity_v2.pkl --output_folder ./json5 --whether_use_node_id 1
