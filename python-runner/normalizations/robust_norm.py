import warnings
import numpy as np

np.set_printoptions(suppress=True)
warnings.filterwarnings("ignore")


def normalization(ds):
    copy_ds = ds.copy()
    for feature in range(copy_ds.shape[1]):
        mean = np.mean(copy_ds[:, feature])
        stdev = np.std(copy_ds[:, feature])
        copy_ds[:, feature] = (copy_ds[:, feature] - mean) / stdev
        # print(f"Range of feature {feature+1} = {np.ptp(copy_ds[:,feature])}")

    return copy_ds
