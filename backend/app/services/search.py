def search(filters):
    items = apply_sql_filters(filters)
    ranked = rank_items(items, filters)
    return ranked
