import numpy as np


def algorithm(ds, k):
    # Number of columns in dataset
    n = np.shape(ds)[1]

    # The centroids
    centroids = np.mat(np.zeros((k, n)))

    # Create random centroids
    for j in range(n):

        min_j = min(ds[:, j])
        range_j = float(max(ds[:, j]) - min_j)
        centroids[:, j] = min_j + range_j * np.random.rand(k, 1)

    # Return centroids as numpy array
    return centroids
