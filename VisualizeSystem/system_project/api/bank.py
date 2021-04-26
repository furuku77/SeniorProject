import networkx as nx
import pandas as pd
from nested_dict import nested_dict
import collections

def combine_hour(analyze,x,choose,check,start,end):
    
    t_index = pd.DatetimeIndex(pd.date_range(start=f'{start} 00:00:00', end=end, freq=x))[0:-1]
    

    if choose == 'Dest':
        if check:
            plo = analyze.resample(x, on= "Time").agg({
                                      'Orig' : lambda x: list(x),
                                      'Op Al' : lambda x: list(x),
                                      'Region_orig' : lambda x: list(x),
                                       'Alliance' : lambda x: list(x),
                                       'country_orig' : lambda x: list(x),
                                       'Seats' : lambda x: list(x),
                                        'Flight' : lambda x: list(x),
                                        'Equip' : lambda x: list(x),
                                        'Block Mins' : lambda x: list(x),
                                        "Arr Time" : 'count',
                                         })
        else:
            plo = analyze.resample(x, on= "Time").agg({
                                      'Orig' : lambda x: list(set(x)),
                                      'Op Al' : lambda x: list(set(x)),
                                      'Region_orig' : lambda x: list(set(x)),
                                       'Alliance' : lambda x: list(set(x)),
                                       'country_orig' : lambda x: list(set(x)),
                                       'Seats' : lambda x: list(x)}   
                                       )
            
    else:
        if check:
            plo = analyze.resample(x, on= "Time").agg({
                                      'Dest' : lambda x: list(x),
                                      'Op Al' : lambda x: list(x),
                                      'Region_dest' : lambda x: list(x),
                                       'Alliance' : lambda x: list(x),
                                       'country_dest' : lambda x: list(x),
                                       'Seats' : lambda x: list(x),
                                        'Flight' : lambda x: list(x),
                                        'Equip' : lambda x: list(x),
                                        'Block Mins' : lambda x: list(x),
                                        "Arr Time" : 'count'
                                        })
        else:
            plo = analyze.resample(x, on= "Time").agg({
                                      'Dest' : lambda x: list(set(x)),
                                      'Op Al' : lambda x: list(set(x)),
                                      'Region_dest' : lambda x: list(set(x)),
                                       'Alliance' : lambda x: list(set(x)),
                                       'country_dest' : lambda x: list(set(x)),
                                       'Seats' : lambda x: list(x)})

    plo = plo.reindex(t_index)
    plo['Arr Time'] = plo['Arr Time'].fillna(0)
    plo = plo.apply(lambda s: s.fillna({i: [] for i in plo.index}))

    print(plo)  
    

    return plo


def freq(plo,choose,check):

    # print('indexx,qlw;,xq;l,mxlqw;')
    # print(plo)

    if choose == 'Orig':
        choose = 'Dest'
    else:
        choose = 'Orig'

    # plo = plo.reset_index()
    meta = nested_dict(2, int)
    
    if(check):
        dic = {}
        for index,row in plo[::-1].iterrows():
            key = list(row[choose])
            val = [0] * len(key)
            seat = dict(zip(key, val))

            my_list = list(row[choose])
            time = str(index)[11:16]
            val2 = list(row['Seats'])
            for i in range(len(my_list)):
                seat[my_list[i]] = seat[my_list[i]] + val2[i]

                data = [row['Op Al'][i],row['Alliance'][i],row['Equip'][i],row['Flight'][i],row['Seats'][i],row['Block Mins'][i]]
                if my_list[i] in meta[time]:
                    meta[time][my_list[i]].append(data)
                else:
                    meta[time][my_list[i]] =  [data]

            dic[time] = seat
    
    else:

        dic = {}
        
        # print(plo.columns)
        for index,row in plo[::-1].iterrows():
            my_list = list(row[choose])
            time = str(index)[11:16]
            for i in range(len(my_list)):
                data = [row['Op Al'][i],row['Alliance'][i],row['Equip'][i],row['Flight'][i],row['Seats'][i],row['Block Mins'][i]]
                if my_list[i] in meta[time]:
                    meta[time][my_list[i]].append(data)
                else:
                    meta[time][my_list[i]] =  [data]          
        
            ctr = collections.Counter(my_list) 
            tmp = dict(ctr)
            dic[time] = tmp

    return (dic , meta)


def select(vis,time):

    if vis == 0:
        num = False
    else:
        num = True

    if time == 0:
        peroid = "15min"
    elif time == 1:
        peroid = "30min"
    elif time == 2:
        peroid = "1H"
    elif time == 3:
        peroid = "4H"
    elif time == 4:
        peroid = "6H"

    return num,peroid
    



              