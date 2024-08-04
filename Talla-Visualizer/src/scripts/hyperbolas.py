import numpy as np
import itertools
from collections import namedtuple
from math import *

# Class that generates hyperbola curves
class HyperPlotter:

    # hyperbola plotting parameter step
    t_step = 0.1

    # hyperbola attributes for an anchor pair:
    #  c - hyperbola parameter c (half anchor distance)
    #  shift - coordinates shift
    #  phi - coordinates rotation andgle
    #  rot - coordinates rotation matrix
    Attrs = namedtuple('Attrs', ['c', 'shift', 'phi', 'rot'])

    # anchors is a dict {id:(x, y)}
    # bl - bottom-left boundary, if None, it's taken from the anchor set
    # tr - top-right boundary, if None, it's taken from the anchor set
    # NB! all the anchors are assumed to be within the boundaries
    def __init__(self, anchors, bl=None, tr=None):
        self.pairs = {}
        # per anchor pair, precompute c, coordinates shift and rotation 
        for i, k in itertools.combinations(anchors.keys(), 2):
            a = anchors[i]
            b = anchors[k]
            print(a, b)
            dist = sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)
            shift = (np.matrix(a).transpose() + np.matrix(b).transpose()) / 2
            if (b[0]==a[0]):
                phi = pi/2
            else:
                phi = atan((b[1]-a[1])/(b[0]-a[0]))

            sphi = sin(phi)
            cphi = cos(phi)
            rot = np.matrix([[cphi,-sphi],[sphi,cphi]])
            attr = HyperPlotter.Attrs(dist/2, shift, phi, rot)
            self.pairs[(i, k)] = attr
            self.pairs[(k, i)] = attr

        self.bl = bl
        self.tr = tr
        av = anchors.values()
        if bl is None:
            self.bl = (min(a[0] for a in av), min(a[1] for a in av)) # bottom-left corner
        if tr is None:
            self.tr = (max(a[0] for a in av), max(a[1] for a in av)) # top-right corner

    # Builds a hyperbola for the two anchor IDs a1 and a2 and the
    # distance difference between the tag and the two anchors
    #
    # returns hyperbola points in two separate arrays: x and y
    # the arrays contain NaN values to break the plotting lines of hyperbola branches
    def mk_curves(self, a1, a2, dist_diff):

        bl = self.bl
        tr = self.tr

        a = dist_diff / 2   # hyperbola's parameter a

        # get the pair attributes from the cache
        pair = self.pairs[(a1, a2)]
        xarray = []
        yarray = []
        xa, ya = self.curve(a, pair, 0, self.t_step, bl, tr)
        xarray += xa + [np.nan]
        yarray += ya + [np.nan]
        xa, ya = self.curve(a, pair, pi, -self.t_step, bl, tr)
        xarray += xa + [np.nan]
        yarray += ya + [np.nan]
        xa, ya = self.curve(a, pair, pi, self.t_step, bl, tr)
        xarray += xa + [np.nan]
        yarray += ya + [np.nan]
        xa, ya = self.curve(a, pair, 0, -self.t_step, bl, tr)
        xarray += xa
        yarray += ya

        return [xarray, yarray]

    # parametric function for hyperbola
    @staticmethod
    def hype(a, t, attrs):
        h = np.matrix([[a/cos(t)], [sqrt(attrs.c**2-a**2)*tan(t)]])
        p = attrs.rot * h + attrs.shift
        return p[0].item(), p[1].item()

    # is p inside the bounding box [bl, tr] ?
    @staticmethod
    def inside(p, bl, tr):
        return p[1] < tr[0] and p[0] > bl[0] and p[1]<tr[1] and p[1] > bl[1]

    # build 1/4 of hyperbola curve within the bounding box [bl, tr]
    # t defines the starting parameter, delta the direction and step
    @staticmethod
    def curve(a, attrs, t, delta, bl, tr):
        p = HyperPlotter.hype(a, t, attrs)

        xarr = []
        yarr = []
        while HyperPlotter.inside(p, bl, tr):
            xarr.append(p[0])
            yarr.append(p[1])
            t += delta
            p = HyperPlotter.hype(a, t, attrs)
        xarr.append(p[0])
        yarr.append(p[1])
        return (xarr, yarr)
