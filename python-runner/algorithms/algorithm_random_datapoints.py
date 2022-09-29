import random


def algorithm(ds, k):
    index_list = random.sample(range(1, len(ds)), k)
    centroids = ds[index_list]
    return centroids
