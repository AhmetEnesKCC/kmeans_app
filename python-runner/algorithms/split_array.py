import numpy as np

def split_arr(ds, threshold, j):
    if np.size(ds) == 0:
        return None
    min_val = ds[0, 0]

    k = 0
    for i in range(len(ds)):
        if ds[k, 0]-min_val <= threshold:

            k += 1
        else:
            break

    return [j+k, ds[0:k, :]]