import matplotlib as mpl
from pylab import *
from numpy import outer, arange, ones
cmap = mpl.colors.LinearSegmentedColormap.from_list(
    "", ["red", "violet", "blue"])
a = outer(arange(0, 1, 0.01), ones(10))
imshow(a, aspect='auto', cmap=cmap, origin="lower")
