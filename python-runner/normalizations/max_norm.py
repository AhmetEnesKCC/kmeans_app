import warnings
import numpy as np

np.set_printoptions(suppress=True)
warnings.filterwarnings("ignore")


def normalization(ds):

    copy_ds = ds.copy()
    for feature in range(copy_ds.shape[1]):
        m = np.absolute(np.max(copy_ds[:, feature]))
        copy_ds[:, feature] = copy_ds[:, feature] / m
        # print(f"Range of feature {feature+1} = {np.ptp(copy_ds[:,feature])}")
    return copy_ds
