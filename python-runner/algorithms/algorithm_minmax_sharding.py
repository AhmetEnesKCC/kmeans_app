import numpy as np
from split_array import split_arr


def algorithm(ds, k):

    n = np.shape(ds)[1]

    centroids = np.mat(np.zeros((k, n)))

    composite = np.sum(ds, axis=1)

    composite = np.reshape(composite, (len(ds), 1))

    ds = np.append(composite, ds, axis=1)

    ds.sort(axis=0)

    ds_range = np.max(ds[:, 0]) - np.min(ds[:, 0])

    threshold = ds_range / k
    prev_arr = split_arr(ds, threshold, 0)

    for j in range(k):

        centroids[j, :] = np.sum(prev_arr[1][:, 1:], axis=0) / np.shape(prev_arr[1])[0]

        prev_arr = split_arr(ds[prev_arr[0] :, :], threshold, prev_arr[0])

    return centroids
