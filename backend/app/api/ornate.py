@router.get("/search")
def search_jewellery(filters: SearchFilters):
    return search_service.search(filters)
