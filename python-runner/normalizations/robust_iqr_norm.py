import warnings
import numpy as np

np.set_printoptions(suppress=True)
warnings.filterwarnings("ignore")


def normalization(ds: np.array) -> np.array:
    copy_ds = ds.copy()
    for feature in range(copy_ds.shape[1]):
        perc_25 = np.percentile(copy_ds[:, feature], 25)
        median = np.median(copy_ds[:, feature])
        perc_75 = np.percentile(copy_ds[:, feature], 75)
        tresh = median / (perc_75 - perc_25)
        copy_ds[:, feature] = copy_ds[:, feature] / tresh
        print(
            f"25 perc: {perc_25}\nMedian: {median}\n75perc: {perc_75}\nTreshold:{tresh}\n\n"
        )
    return copy_ds
