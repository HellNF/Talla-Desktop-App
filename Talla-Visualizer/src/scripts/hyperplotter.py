'''
Author: Davide Vecchia (davide.vecchia.p@gmail.com)
Date: 10/09/2024

# TDoA hyperbola visualization
'''


import numpy as np

class HyperPlotter:
    def __init__(self,
                 anchors,
                 frame=((-10,-10),(10,10))):
        """
        Initialize the Hyperplotter with anchor points and a frame.

        :param anchors: A dictionary with integer keys and (x, y) tuple values.
        :param frame: A tuple defining the plotting frame, e.g., ((x_min, y_min), (x_max, y_max)).
        """
        self.anchors = anchors
        self.frame = frame

    def hyperbola_from_dist_diff(self, anchor1, anchor2, dist_diff,
                                 frame=((-10,-10),(10,10)),
                                 asymptote_closeness=10,
                                 density=100,
                                 single_branch=True):

        # Unpack anchor points
        x1, y1 = anchor1
        x2, y2 = anchor2

        # Calculate the center point
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        # Calculate the distance between the anchors
        d = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)

        # Calculate semi-major axis (a) and semi-minor axis (b)
        a = abs(dist_diff) / 2
        b = np.sqrt((d / 2)**2 - a**2) if (d / 2) > a else 0  # Ensure b is real

        # Generate points for the hyperbola
        t = np.linspace(-asymptote_closeness, asymptote_closeness, density)
        x_positive = a * np.cosh(t)
        y_positive = b * np.sinh(t)
        x_negative = -a * np.cosh(t)
        y_negative = -b * np.sinh(t)

        # Rotate and translate the hyperbola
        angle = np.arctan2(y2 - y1, x2 - x1)
        def rotate_and_translate(x, y):
            x_rotated = x * np.cos(angle) - y * np.sin(angle) + center_x
            y_rotated = x * np.sin(angle) + y * np.cos(angle) + center_y
            return x_rotated, y_rotated
        x_pos_rotated, y_pos_rotated = rotate_and_translate(x_positive, y_positive)
        x_neg_rotated, y_neg_rotated = rotate_and_translate(x_negative, y_negative)

        # Filter out points outside the frame
        if frame is not None:
            x_min, y_min = frame[0]
            x_max, y_max = frame[1]

            # Positive branch filtering
            pos_mask = (x_pos_rotated >= x_min) & (x_pos_rotated <= x_max) & \
                    (y_pos_rotated >= y_min) & (y_pos_rotated <= y_max)
            print(x_pos_rotated, '\n', y_pos_rotated, '\n', pos_mask)
            x_pos_rotated = x_pos_rotated[pos_mask]
            y_pos_rotated = y_pos_rotated[pos_mask]

            # Negative branch filtering
            neg_mask = (x_neg_rotated >= x_min) & (x_neg_rotated <= x_max) & \
                    (y_neg_rotated >= y_min) & (y_neg_rotated <= y_max)
            x_neg_rotated = x_neg_rotated[neg_mask]
            y_neg_rotated = y_neg_rotated[neg_mask]

        # Return only one hyperbola branch, based on the sign of distance difference
        if single_branch:
            if dist_diff >= 0:
                return (x_pos_rotated, y_pos_rotated)
            else:
                return (x_neg_rotated, y_neg_rotated)
        return ((x_pos_rotated, y_pos_rotated), (x_neg_rotated, y_neg_rotated))

    def mk_curves(self, anchor1_id, anchor2_id, dist_diff, single_branch=True):
        """
        Generate points for plotting hyperbolas based on anchor IDs and distance difference.

        :param a1: The ID of the first anchor.
        :param a2: The ID of the second anchor.
        :param dist_diff: The distance difference for the hyperbola.
        :return: A list containing x and y coordinates for plotting.
        """
        # Retrieve anchor coordinates from the dictionary
        anchor1 = self.anchors[anchor1_id]
        anchor2 = self.anchors[anchor2_id]

        # Call the hyperbola generation method
        branches = self.hyperbola_from_dist_diff(anchor1, anchor2, dist_diff, frame=self.frame, single_branch=single_branch)

        # Prepare the output arrays for plotting
        xarray = []
        yarray = []

        # Check if branches is a tuple (for both branches) or a single branch
        if isinstance(branches[0], tuple):
            for branch in branches:
                x_rotated, y_rotated = branch
                if x_rotated is not None and y_rotated is not None:
                    xarray.extend(x_rotated)
                    yarray.extend(y_rotated)

                    # Append np.nan to separate branches when plotting
                    xarray.append(np.nan)
                    yarray.append(np.nan)
        else:
            x_rotated, y_rotated = branches
            if x_rotated is not None and y_rotated is not None:
                xarray.extend(x_rotated)
                yarray.extend(y_rotated)

        # Remove the last np.nan if it was added unnecessarily
        if len(xarray) > 0 and np.isnan(xarray[-1]):
            xarray.pop()
            yarray.pop()

        return [xarray, yarray]

def main():
    anchors = {
        1: (0, 0),   # Anchor 1 at origin
        2: (4, 0)    # Anchor 2 at (4, 0)
    }

    # Create an instance of HyperPlotter
    plotter = HyperPlotter(anchors)

    # Define distance difference
    dist_diff = 2  # Example distance difference

    # Call mk_curves to generate hyperbola points
    x_y_curves = plotter.mk_curves(anchor1_id=1, anchor2_id=2, dist_diff=dist_diff, single_branch=True)
    x_array, y_array = x_y_curves

    # Create a new figure
    plt.figure(figsize=(8, 6))

    # Plot the hyperbola points
    plt.plot(x_array, y_array, label='Hyperbola', color='blue')

    # Add labels and title
    plt.title('Hyperbola Plot')
    plt.xlabel('X coordinates')
    plt.ylabel('Y coordinates')

    # Set the limits of the plot
    plt.xlim(-10, 10)
    plt.ylim(-10, 10)

    # Add a grid
    plt.grid()

    # Add a legend
    plt.legend()

    # Show the plot
    plt.axhline(0, color='black',linewidth=0.5, ls='--')
    plt.axvline(0, color='black',linewidth=0.5, ls='--')
    plt.show()

if __name__ == "__main__":
    import matplotlib.pyplot as plt
    main()
