from asyncio.windows_events import NULL
import sys
from tokenize import Double
from unicodedata import decimal, name
import warnings
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
import sklearn.datasets as skDatasets
import time
import json
import importlib.util
from decimal import Decimal

warnings.filterwarnings("ignore")
np.set_printoptions(suppress=True)


args = json.load(open("python-runner/arguments.json"))


datasets = args["datasets"]
algorithms = args["algorithms"]
normalizations = args["normalizations"]


loop = args["loop"]


def writeToResult(results):
    f = open("python-runner/result.json", "w")
    f.write(json.dumps(results))
    f.close()


def kmeans(ds, k, algorithm):

    global timer_start
    global timer_end
    global total_timer_end
    return_object = {}
    global cents
    global sse
    global iters
    cents = []

    timer_start = time.perf_counter()
    cents = algorithm(ds, k)
    timer_end = time.perf_counter()

    km = KMeans(n_clusters=k, init=cents).fit(ds)
    total_timer_end = time.perf_counter()
    iters = km.n_iter_
    cents = km.cluster_centers_
    sse = km.inertia_
    # return_object["cents"] = cents.tolist()
    return_object["time"] = float(Decimal(timer_end) - Decimal(timer_start))
    return_object["total-time"] = float(Decimal(total_timer_end) - Decimal(timer_start))
    return_object["sse"] = sse / len(ds)
    return_object["iter"] = iters
    return return_object


dataFrames = []
algorithmFunctions = []
normalizationFunctions = []
results = []

for normalization in normalizations:
    if normalization["label"] == "no":
        normalizationFunctions.append(
            {
                "name": normalization["label"],
                "type": "no",
                "function": "none",
            }
        )
        continue
    spec = importlib.util.spec_from_file_location(
        normalization["label"], normalization["path"]
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    normalizationFunction = module.normalization
    normalizationFunctions.append(
        {
            "name": normalization["label"],
            "labelWOExt": normalization["labelWOExt"],
            "type": "function",
            "function": normalizationFunction,
        }
    )

for dataset in datasets:
    df = pd.read_csv(dataset["path"], sep="\s+|\t|;|,")
    df = df.astype(float)
    df = df.to_numpy()
    dfs = {}
    dfs["name"] = dataset["name"]
    dfs["labelWOExt"] = dataset["labelWOExt"]
    dfs["dataframes"] = []
    for normalization in normalizationFunctions:
        if normalization["type"] == "function":
            df = normalization["function"](df)
        dfs["dataframes"].append({"dataframe": df, "normalization": normalization})
    dataFrames.append(dfs)

for algorithm in algorithms:
    spec = importlib.util.spec_from_file_location(algorithm["label"], algorithm["path"])
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    algorithmFunction = module.algorithm
    algorithmFunctions.append(
        {
            "name": algorithm["label"],
            "function": algorithmFunction,
            "labelWOExt": algorithm["labelWOExt"],
        }
    )

for ds in dataFrames:
    dsResult = {}
    dsResult["categories"] = []
    dsResult["series"] = {"sse": [], "time": []}
    dsResult["data"] = []
    dsResult["labelWOExt"] = ds["labelWOExt"]

    for al in algorithmFunctions:
        for df in ds["dataframes"]:
            algorithm_name = al["name"]
            dataset_name = ds["name"]
            normalization = df["normalization"]
            normalization_name = normalization["name"]
            dsResult["categories"].append(
                al["labelWOExt"] + "-" + normalization["labelWOExt"]
            )
            result = {
                "sse": 0,
                "iter": 0,
                "time": 0,
                "total-time": 0,
            }
            result["algorithm_name"] = algorithm_name
            result["dataset_name"] = dataset_name
            result["normalization_name"] = normalization_name
            for i in range(loop):
                kmeans_result = kmeans(df["dataframe"], 3, al["function"])
                sse = kmeans_result["sse"]
                time_ = kmeans_result["time"]
                total_time = kmeans_result["total-time"]
                iters = kmeans_result["iter"]
                result["sse"] += sse
                result["time"] += time_
                result["total-time"] += total_time
                result["iter"] += iters
                print(
                    f"-step- {algorithm_name} run with dataset: {dataset_name} by normalization: {normalization_name} for {i + 1} times."
                )
            result["sse"] /= loop
            result["time"] /= loop
            result["total-time"] /= loop
            result["iter"] /= loop
            dsResult["data"].append(result)
            dsResult["series"]["sse"].append(result["sse"])
            dsResult["series"]["time"].append(result["time"])
    results.append(dsResult)
writeToResult(results)
