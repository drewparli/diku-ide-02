import numpy as np

input_name = "kbhEU.csv"
output_name = "yearlyInfoEU.csv"
open(output_name, "w").close() #empty file first
output = open(output_name, "a")
output.write("YEAR,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC\n")

curr_year = 1880
curr_month = 1
days_in_month = []

with open(input_name) as f:
    f.readline() #ignore first line
    for line in f:
        splitted = line.split(",")
        date = splitted[2]
        year, month, day = int(date[:4]), int(date[4:6]), int(date[6:])
        temp = int(splitted[3]) / 10

        if curr_month != month:
            if curr_month == 1:
                output.write(str(curr_year) + ",")

            if len(days_in_month) == 0:
                output.write("999.9")
            else:
                output.write("{0:.1f}".format(np.mean(days_in_month)))

            if curr_month == 12:
                curr_month = 1
                curr_year += 1
                output.write("\n")
            else:
                curr_month += 1
                output.write(",")

            days_in_month =[]
        else:
            if temp != -999.9:
                days_in_month.append(temp)

if len(days_in_month) == 0:
    output.write("999.9")
else:
    output.write("{0:.1f}".format(np.mean(days_in_month)))

f.close()
output.close()