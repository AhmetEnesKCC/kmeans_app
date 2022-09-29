import numpy as np
import math
from euclid import euc


def algorithm(ds, k):

    n = np.shape(ds)[1]

    m = np.shape(ds)[0]

    centroids = np.mat(np.zeros((k, n)))

    composite = np.sum(ds, axis=1)

    composite = np.reshape(composite, (len(ds), 1))

    ds = np.append(composite, ds, axis=1)

    ds.sort(axis=0)

    breakPoints = np.zeros((k - 1), dtype=int)

    partSize = int(math.floor(m / k))

    for i in range(k - 1):
        breakPoints[i] = partSize * (i + 1)

    step = 0
    while step < k - 1:

        prev_point = 0
        next_point = m - 1
        break_point = breakPoints[step]
        if step != 0:
            prev_point = breakPoints[step - 1]
        if step < k - 2:
            next_point = breakPoints[step + 1]

        current_mean = np.sum(ds[prev_point : (break_point - 1), 1:], axis=0) / (
            (break_point - prev_point)
        )
        next_mean = np.sum(ds[break_point:next_point, 1:], axis=0) / (
            (next_point - break_point)
        )

        current_distance = euc(current_mean, ds[break_point, 1:])
        next_distance = euc(next_mean, ds[break_point, 1:])
        if next_distance > current_distance:
            breakPoints[step] = breakPoints[step] + 1
            step = step + 1
        else:
            breakPoints[step] = breakPoints[step] - 1

    for j in range(k):
        if j == 0:
            centroids[j:] = (
                np.sum(ds[0 : breakPoints[0] - 1, 1:], axis=0) / breakPoints[j] - 1
            )
        elif j == k - 1:
            centroids[j:] = np.sum(ds[breakPoints[j - 1] :, 1:], axis=0) / (
                m - breakPoints[j - 1]
            )
        else:
            centroids[j:] = np.sum(
                ds[breakPoints[j - 1] : breakPoints[j] - 1, 1:], axis=0
            ) / (breakPoints[j] - breakPoints[j - 1] - 1)

    return centroids
