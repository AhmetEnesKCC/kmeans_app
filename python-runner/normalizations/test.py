import pandas as pd
import warnings
import numpy as np
import robust_iqr_norm

np.set_printoptions(suppress=True)
warnings.filterwarnings("ignore")

df = pd.read_csv("python-runner/datasets/" + "a1.csv", sep=" ").to_numpy()

normalize = robust_iqr_norm.normalization(df)
