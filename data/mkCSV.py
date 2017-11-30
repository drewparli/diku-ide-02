import re


if __name__ == '__main__':
    with open("dc.txt", "r") as source:
        raw_data = source.read()
        with open("dc.csv", "w") as new:
            new.write(re.sub(r'[ ]+', r',', raw_data))