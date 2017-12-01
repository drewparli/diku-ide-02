import re
import sys

if __name__ == '__main__':

    fname = sys.argv[1]

    name = fname.split(".")[0]

    with open(fname, "r") as source:
        raw_data = source.read()
        with open(name + ".csv", "w") as new:
            new.write(re.sub(r'[ ]+', r',', raw_data))