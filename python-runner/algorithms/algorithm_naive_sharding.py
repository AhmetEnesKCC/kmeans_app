import numpy as np
import math


def _get_mean(sums, step):
    return sums / step


def algorithm(ds, k):
    n = np.shape(ds)[1]

    m = np.shape(ds)[0]

    centroids = np.mat(np.zeros((k, n)))

    composite = np.sum(ds, axis=1)
    composite = np.reshape(composite, (len(ds), 1))

    ds = np.append(composite, ds, axis=1)

    ds.sort(axis=0)
    step = math.floor(m / k)

    vfunc = np.vectorize(_get_mean)

    for j in range(k):
        if j == k - 1:
            centroids[j:] = vfunc(np.sum(ds[j * step :, 1:], axis=0), step)
        else:
            centroids[j:] = vfunc(
                np.sum(ds[j * step : (j + 1) * step, 1:], axis=0), step
            )

    return centroids
