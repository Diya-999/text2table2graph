### node
python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t1/entity_1.pkl --extract_column_list "entity 1" --map_cols '{"entity 1":"node"}'

python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t1/entity_2.pkl --extract_column_list "entity 2" --map_cols '{"entity 2":"node"}'

### edge
python pkl2df.py --input_folder ./staging/stg_e/dj_news/rel_on_ner/ --output_path ./staging/tmp_t1/entity2entity.pkl --extract_column_list "entity 1" "entity 2" relation --map_cols '{"entity 1":"node1", "entity 2":"node2"}'

### get ner
python pkl2df.py --input_folder ./staging/stg_e/dj_news/ner/ --output_path ./staging/tmp_t1/node_attr_news_ner.pkl  --extract_column_list name tag source --map_cols '{"source":"node"}'

### gen_node_edge.py
### gen node
python gen_node_edge.py --input_path ./staging/tmp_t1/entity_1.pkl ./staging/tmp_t1/entity_2.pkl --output_path ./staging/tmp_t1/entity_v1.pkl --type node --unique_cols node

### gen edge
python gen_node_edge.py --input_path ./staging/tmp_t1/entity2entity.pkl --output_path ./staging/tmp_t1/entity2entity_v1.pkl --type edge  --unique_cols node1 node2

### add_nodes_attrs
python add_nodes_attrs.py --input_path ./staging/tmp_t1/entity_v1.pkl --add_attr_maps '[{"attr_name":"shape","attr_val":"circularImage"},{"attr_name":"image","attr_val":"entity.png"}]' --output_path ./staging/tmp_t1/entity_v2.pkl

python add_nodes_attrs.py --input_path ./staging/tmp_t1/entity_v2.pkl --input_attr_path ./staging/tmp_t1/node_attr_news_ner.pkl --input_attr_map '{"node":"source","name":"node","tag":"entity_tag"}' --merge_on node --add_mode one-to-many --integrate_approach set --add_cols entity_tag --output_path ./staging/tmp_t1/entity_v3.pkl

### add_edges_attrs
python add_edges_attrs.py --input_path ./staging/tmp_t1/entity2entity_v1.pkl --input_attr_path ./staging/tmp_t1/entity2entity_v1.pkl --add_cols relation --output_path ./staging/tmp_t1/entity2entity_v2.pkl

### gen json dataset
python df2json.py --input_edge_path ./staging/tmp_t1/entity2entity_v2.pkl --input_node_path ./staging/tmp_t1/entity_v3.pkl --output_folder ./json1 --whether_use_node_id 0
