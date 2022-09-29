import numpy as np
import math
from itertools import combinations


def algorithm(ds, k):
    a = 2
    if k == 2:
        centroids = np.array([ds.min(axis=0), ds.max(axis=0)])

    else:
        min_cent = ds.min(axis=0)
        max_cent = ds.max(axis=0)
        centroids = np.array([min_cent, max_cent])
        num_col = ds.shape[1]
        div = math.ceil(
            num_col / 2
        )  # başta yaklaşık yarı yarıya max/min yapacağımız için
        num_cent = k - a  # hepsi min ve max dışında bulunması gereken centroid sayısı
        i = 0
        while i < num_cent:
            while div > 0:
                if i >= num_cent:
                    break
                num_comb = math.comb(num_col, div)  # kombinasyon sayısı
                cols = list(
                    range(num_col)
                )  # column sayısı kadar ardışık sayıdan oluşan array
                combs = list(
                    combinations(cols, div)
                )  # cols un kombinasyonlarını tutan list
                for j in range(num_comb):
                    if i >= num_cent:
                        break
                    maxes = ds[:, combs[j]].max(
                        axis=0
                    )  # kombinasyondaki columnların max değerleri
                    m = list(set(cols) - set(combs[j]))  # kalan columnlar
                    mins = ds[:, m].min(axis=0)  # kalan columnların min değerleri
                    new_cent = np.zeros(num_col)
                    vals = np.concatenate((maxes, mins))
                    pos = np.concatenate((combs[j], m))
                    new_cent[pos] = vals
                    # indexlerine göre max ve min değerlerini yerleştirip yeni centroidi belirledik.
                    centroids = np.append(centroids, [new_cent], axis=0)
                    i += 1
                div -= 1
    return centroids
