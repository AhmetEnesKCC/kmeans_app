import scipy.spatial.distance as metric

def euc(A, B):
    # Call to scipy with vector parameters

    return metric.euclidean(A, B)