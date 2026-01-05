def compute_score(jewel, outfit):
    score = 0
    if jewel.occasion in outfit.occasion:
        score += 2
    if color_overlap(jewel, outfit):
        score += 1
    return score
