from email.policy import default
import numpy as np


def algorithm(ds, k):
    if k == 2:
        centroids = np.array([ds.min(axis=0), ds.max(axis=0)])

    else:
        min_cent = ds.min(axis=0)

        max_cent = ds.max(axis=0)

        centroids = np.array([min_cent, max_cent])

        diff = (max_cent - min_cent) / (k - 1)

        for i in range(k - 2):
            centroids = np.append(centroids, [min_cent + (i + 1) * diff], axis=0)

    return centroids
