# text2table2graph
python replace_pkl_file.py --input_new_data_path ./pkl/final_rs_on_news_new.pkl --input_old_data_path ./pkl/final_rs_on_news.pkl --output_path ./pkl/final_rs_on_news.pkl

python add_columns.py --input_path ./pkl/final_rs_on_news.pkl --output_path ./pkl/add_columns_df.pkl

python create_dataset_folder.py --valid_ratio 0.1 --train_ratio 0.9 --input_path ./pkl/add_columns_df.pkl --output_path ./dataset/ --filter_by_max_node_size 20 --filter_by_min_node_size 0