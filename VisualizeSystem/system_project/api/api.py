from flask import Flask, request, render_template, make_response
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan
import json
from flask import jsonify
import pandas as pd
import networkx as nx
from connection import *
from bank import *
from nested_dict import nested_dict
from datetime import datetime, timedelta
from collections import Counter 


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])


@app.route('/api', methods=['POST', 'GET'])
# @cross_origin()
def api():
    print(request.method)

    if request.method == 'POST':
        print(request.get_json())
        # print(request.get_json())
        data = request.get_json()['station']['station']
        data1 = request.get_json()['station']['Dest']
        choose = request.get_json()['type']
        year = get_year(request.get_json()['year'])
        print(data, data1, year)

        if data == 'BKK' or data1 == 'BKK':
            usefile = 'y' + str(year)
        else:
            usefile = 'y' + str(year) + '_stop'

        print(usefile)

        query_body = {
            "query": {
                "bool": {
                    "filter": [
                     {"term":  {"Orig.keyword": data}},
                        {"term":  {"Dest.keyword": data1}},

                    ]
                }
            }
        }
        results_gen = scan(
            es,
            query=query_body,
            index=usefile,
        )

        results = list(results_gen)
        dara = pd.DataFrame([i['_source'] for i in results])

        time_series  = dara.copy()
        month, passen,min_month,max_month = sum_path_month(time_series)
        dara = dara.drop(columns=['Travel Month'])
        dara = dara[dara.Dest == data1]
        print("in API newwww")

        sum_route = sum_passenger(dara)

        # print(sum_route[sum_route['Orig'].isnull()])

        lis = select_stop(sum_route)

        support = ""
        top = ""

        # non = lis[0]['passenger'].sum()
        # stop1 = lis[1]['passenger'].sum()
        # stop2 = lis[2]['passenger'].sum()
        # stop3 =lis[3]['passenger'].sum()


        print((lis[1]['passenger'].sum() + lis[2]['passenger'].sum() + lis[3]['passenger'].sum()))

        if (lis[0]['passenger'].sum()/2) >= (lis[1]['passenger'].sum() + lis[2]['passenger'].sum() + lis[3]['passenger'].sum()):
            support = "Severed"
        else:
            support = "Underserved"


        



        # print(lis[2])

        group, overall = make_link(lis)
        if overall[overall.node2 == "BKK"].shape[0] != 0:
            prev = overall[overall.node2 == "BKK"].sort_values('count', ascending=False).iloc[0]['node1']
        else:
            prev = "none"

        if overall[overall.node1 == "BKK"].shape[0] != 0:
            nexts = overall[overall.node1 == "BKK"].sort_values('count', ascending=False).iloc[0]['node2']
        else:
            nexts = "none"


        print(prev,nexts)
        print(overall[overall.node2 == "BKK"].shape[0])
        # overall = overall
        overall['link'] = overall[['node1', 'node2']].apply(tuple, axis=1)
        overall['val'] = overall[['passenger', 'count']].apply(list, axis=1)
        # print(overall.head())
        vis = overall[['link', 'val']]
        # print(overall.head())

        for_node,LisMax = get_degree(overall)
        # print(for_node)

        # print(pd.DataFrame.from_dict(for_node, orient='index'))

        vis = vis.to_dict('records')
        # print(vis)

        # print(vis)min_month,max_month

        response = {'vis': vis, 'for_node': for_node, 'month' : month, 'passen' : passen, 'support' : support,  "prev" : prev, "next": nexts
        ,'min_month' : min_month, 'max_month' : max_month,'LisMax' : LisMax}

        response = make_response(
            jsonify(response))
        response.headers['Access-Control-Allow-Origin'] = "*"

        return response


@app.route('/transit', methods=['POST', 'GET'])
def transit():

    data = request.get_json()['station']['station']
    data1 = request.get_json()['station']['Dest']
    choose = request.get_json()['type']
    year = get_year(request.get_json()['year'])

    if data == 'BKK' or data1 == 'BKK':
        usefile = 'y' + str(year)
    else:
        usefile = 'y' + str(year) + '_stop'

    print(usefile)

    query_body = {
        "query": {
            "bool": {
                "filter": [
                    {"term":  {"Orig.keyword": data}},
                    {"term":  {"Dest.keyword": data1}},

                ]
            }
        }
    }

    results_gen = scan(
        es,
        query=query_body,
        index=usefile,
    )

    results = list(results_gen)
    dara = pd.DataFrame([i['_source'] for i in results])
    # print(dara)
    dara = dara.drop(columns=['Travel Month'])
    # dara = dara[dara.Dest == data1]
    print("in API newwww")

    sum_route = sum_passenger(dara)

    lis = select_stop(sum_route)
    # print(lis[0]['passenger'].sum())
    
    # print(lis[2])
    dic = {}
    eachC = []
    eachP = []
    AllPattern = {}
    name = ['non_stop', 'Stop1', 'Stop2', 'Stop3']
    findMax = ['Non Stop', '1 Stop', '2 Stops', '3 Stops']
    maxa = 0
    maxa_route = 0
    sumall = 0
    max_type = ""
    max_routing = ""
    for i in range(len(name)):
        eachP.append({'name':findMax[i] ,'value' : str(lis[i]['passenger'].sum())})
        eachC.append({'name':findMax[i] ,'value' : str(lis[i]['passenger'].count())})
        # each[findMax[i]] = (str(lis[i]['passenger'].count()))
        sumall = sumall + lis[i]['passenger'].sum()
        if (maxa < lis[i]['passenger'].sum()):
            maxa = lis[i]['passenger'].sum()
            print(lis[i]['passenger'].sum())
            max_type = "Connecting " + findMax[i]
  
        tmp = []
        for index, row in lis[i].iterrows():
            if i == 0:
                AllPattern[(row['Orig'] + " - " + row['Dest'])] = row['passenger']
                tmp.append(row['Orig'] + " - " + row['Dest'] +
                           " : " + str(row['passenger']))
                if (maxa_route <= row['passenger'] ):
                    maxa_route = row['passenger']
                    max_routing = row['Orig'] + " - " + row['Dest']
            elif i == 1:
                AllPattern[(row['Orig'] + " - " + row['Stop1'] + " - " +  row['Dest'])] = row['passenger']
                # print(row['Orig'] + " -> " + row['Stop1'] + " -> " +  row['Dest'])
                tmp.append(row['Stop1'] +
                           " : " + str(row['passenger']))
                if (maxa_route <= row['passenger'] ):
                    maxa_route = row['passenger']
                    max_routing = row['Orig'] + " - " + row['Stop1'] +" - " + row['Dest']
            elif i == 2:
                AllPattern[(row['Orig'] + " - " +  row['Stop1'] + " - " + row['Stop2'] + " - " +  row['Dest'])] = row['passenger']
                # print(row['Orig'] + " -> " +  row['Stop1'] + " -> " + row['Stop2'] + " -> " +  row['Dest'])
                tmp.append(row['Stop1'] + " - " +
                           row['Stop2']  + " : " + str(row['passenger']))
                if (maxa_route <= row['passenger'] ):
                    maxa_route = row['passenger']
                    max_routing = row['Orig'] + " - " + row['Stop1'] + " - " + row['Stop2'] + " - " + row['Dest'] 
            elif i == 3:
                AllPattern[(row['Orig'] + " - " + row['Stop1'] + " - " + row['Stop2'] + " - " +  row['Stop3'] + " - "  + row['Dest'])] = row['passenger']
                # print(row['Orig'] + " -> " + row['Stop1'] + " -> " + row['Stop2'] + " -> " +  row['Stop3'] + " -> "  + row['Dest'])
                tmp.append(row['Stop1'] + " - " +
                           row['Stop2'] + " - " + row['Stop3'] + " : " + str(row['passenger']))
                if (maxa_route <= row['passenger'] ):
                    maxa_route = row['passenger']
                    max_routing = row['Orig'] + " - " + row['Stop1'] + " - " +row['Stop2'] + " - " + row['Stop3'] + " - " + row['Dest'] 

        dic[name[i]] = tmp
        dic['max_routing'] = max_routing

    # print(AllPattern)

    k = Counter(AllPattern)
    high = k.most_common(10) 

    # print(high)
    Yaxis = []
    Xaxis = []
    for i in high:
        Yaxis.append(i[0])
        Xaxis.append(i[1])

    PlotBar = [Xaxis[::-1],Yaxis[::-1]]

    print(PlotBar)
        


    dic['max_type'] = max_type
    dic['sumall'] = str(sumall)
    dic['each'] = [eachP,eachC]
    dic['PlotBar'] = PlotBar


    top_tran = make_response(
        jsonify(dic))
    top_tran.headers['Access-Control-Allow-Origin'] = "*"

    # print(top_tran)

    return top_tran


@app.route('/top20', methods=['POST', 'GET'])
def top20():
    print(request.method)
    lis = ['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America','Africa' ]

    print("----------",request.get_json(),"--------------")
    # print(request.get_json())
    # choose = request.get_json()['type']
    region = request.get_json()['region']
    year = request.get_json()['year']
    year = get_year(year)
    region = lis[region]

    lis = ['bkk_orig', 'bkk_dest','bkk_stop']
    table = {}

    for i in lis:
        if i == 'bkk_orig' or i == 'bkk_dest':
            if i == 'bkk_orig':
                query_body = {
                    "query": {
                        "bool": {
                            "filter": [
                                {"term":  {"Orig.keyword": "BKK"}},
                                {"term":  {"Region_dest.keyword": region}}
                            ]
                        }
                    }
                }
            else:
                query_body = {
                    "query": {
                        "bool": {
                            "filter": [
                                {"term":  {"Dest.keyword": "BKK"}},
                                {"term":  {"Region_orig.keyword": region}}
                            ]
                        }
                    }
                }

            results_gen = scan(
                es,
                query=query_body,
                index='y'+ year,
            )

        else:
            query_body = {
                    "query": {
                        "bool": {
                            "filter": [
                                {"term":  {"Region_orig.keyword": region}}
                            ]
                        }
                    }
                }

            results_gen = scan(
                es,
                query=query_body,
                index='y' + year + '_stop',
            )

        results = list(results_gen)
        dara = pd.DataFrame([i['_source'] for i in results])
        dara = dara.drop(columns=['Travel Month'])
        

        top = sum_path(dara)
        top['link'] = top[['Orig', 'Dest']].agg('-'.join, axis=1)

        top = list(top['link'])

        table[i] = top


    response = make_response(
        jsonify(table))
    response.headers['Access-Control-Allow-Origin'] = "*"


    return response


@app.route('/BKK_O_D', methods=['POST', 'GET'])
def BKK_O_D():
    # if request.method == 'POST':
    if True:
        print(55555555555555555555)
        print(request.get_json())
        choose = request.get_json()['type']
        # if choose > 1:
        #     choose = 0
        year = request.get_json()['year']
        year = "y" + get_year(year)


        if choose == 0:
            query_body = {
                "query": {
                    "match": {
                        "Orig": 'BKK'
                    }
                }
            }

        elif choose == 1:
            query_body = {
                "query": {
                    "match": {
                        "Dest": 'BKK'
                    }
                }
            }

        # results = es.search(index='y2019')['hits']['hits']

        results_gen = scan(
            es,
            query=query_body,
            index=year,
        )

        results = list(results_gen)
        dara = pd.DataFrame([i['_source'] for i in results])
        dara = dara.drop(columns=['Travel Month'])
        print(dara.shape)

        sum_route = sum_passenger(dara)
        region = ['Asia', 'Europe', 'Middle East', 'North America', 'Russian Federation', 'South America', 'Australasia', 'Caribbean', 'Central America','Africa' ]

        

        # sum_route = dara.copy()
        if choose == 0:
            country_dest = sum_route.groupby('country_dest')[['passenger', 'count']].apply(
                lambda x: x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
            max_passenger = country_dest['passenger'].max()
            max_count = country_dest['count'].max()
            country_dest['val'] = country_dest[[
                'passenger', 'count']].apply(list, axis=1)
            country_dest = country_dest.rename(
                columns={'country_dest': 'name'})
            country_dest = country_dest[['name', 'val']].to_dict('records')
            lis = [int(max_passenger), int(max_count)]

            region_dest = sum_route.groupby('Region_dest')[['passenger', 'count']].apply(
                lambda x: x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
            region_dest['val'] = region_dest[[
                'passenger', 'count']].apply(list, axis=1)
            region_dest = region_dest.rename(columns={'Region_dest': 'name'})
            region_dest = region_dest[['name', 'val']].to_dict('records')

            top_region = {}
            top_station = {}
            for i in region:
                # print(sum_route[sum_route['Region_dest'] == i].sort_values('passenger', ascending=False))
                # print("-----",sum_route[sum_route['Region_dest'] == i].sort_values('passenger', ascending=False).iloc[0],"-----")
                tmp = sum_route[sum_route['Region_dest'] == i].sort_values('passenger', ascending=False)
                tmp = tmp.groupby(['country_dest']).sum().sort_values('passenger', ascending=False).reset_index()

                
                # top_region[i] = sum_route[sum_route['Region_dest'] == i].sort_values('passenger', ascending=False).iloc[0]['country_dest']
                top_region[i] =  tmp.iloc[0]['country_dest']
                top_station[i] = sum_route[sum_route['Region_dest'] == i].sort_values('passenger', ascending=False).iloc[0]['Dest']
            response = {'vismap': country_dest,
                        'piechart': region_dest, 'max': lis, 'top_region' : top_region , 'top_station' : top_station}

        elif choose == 1:
            country_orig = sum_route.groupby('country_orig')[['passenger', 'count']].apply(
                lambda x: x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
            max_passenger = country_orig['passenger'].max()
            max_count = country_orig['count'].max()

            lis = [int(max_passenger), int(max_count)]
            country_orig['val'] = country_orig[[
                'passenger', 'count']].apply(list, axis=1)
            country_orig = country_orig.rename(
                columns={'country_orig': 'name'})
            country_orig = country_orig[['name', 'val']].to_dict('records')

            region_orig = sum_route.groupby('Region_orig')[['passenger', 'count']].apply(
                lambda x: x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
            region_orig['val'] = region_orig[[
                'passenger', 'count']].apply(list, axis=1)
            region_orig = region_orig.rename(columns={'Region_orig': 'name'})
            region_orig = region_orig[['name', 'val']].to_dict('records')

            top_region = {}
            top_station = {}
            for i in region:
                # print(sum_route[sum_route['Region_orig'] == i])
                tmp = sum_route[sum_route['Region_orig'] == i].sort_values('passenger', ascending=False)
                tmp = tmp.groupby(['country_orig']).sum().sort_values('passenger', ascending=False).reset_index()

                top_region[i] =  [tmp.iloc[0]['country_orig']]
                top_station[i] = sum_route[sum_route['Region_orig'] == i].sort_values('passenger', ascending=False).iloc[0]['Orig']

                # top_region[i] = sum_route[sum_route['Region_orig'] == i].sort_values('passenger', ascending=False).iloc[0]['country_orig']

            response = {'vismap': country_orig,
                        'piechart': region_orig, 'max': lis , 'top_region' : top_region, 'top_station' : top_station }

        # print(response)

        response = make_response(
            jsonify(response))
        response.headers['Access-Control-Allow-Origin'] = "*"

        return response


@app.route('/overall_bank', methods=['GET', 'POST'])
def overall_bank():

    lis = ['Orig', 'Dest']

    print(request.get_json()['date'], request.get_json()[
          'vis'], request.get_json()['time'])

    date = request.get_json()['date'][:-1]
    vis = request.get_json()['vis']
    time = request.get_json()['time']
    search = request.get_json()['search']

    num, peroid = select(vis, time)

    date = datetime.fromisoformat(date)
    year = date.year
    start = (date + timedelta(days=1)).strftime('%Y-%m-%d')
    end = (date + timedelta(days=2)).strftime('%Y-%m-%d')
    print(start, end,search)

    table = {}
    chart = pd.DataFrame()

    for i in range(0, 2):

        if search != "":

            query_body = {
                "query": {
                    "bool": {
                        "filter": [
                        {"term":  {lis[i] + ".keyword": "BKK"}},
                        {"term":  {lis[i-1] + ".keyword": search}},
                            {"range": {"Time.keyword": {"gt": start, "lt": end

                                                        }}}
                        ]
                    }
                }
            }
        else:
            query_body = {
                "query": {
                    "bool": {
                        "filter": [
                        {"term":  {lis[i] + ".keyword": "BKK"}},
                            {"range": {"Time.keyword": {"gt": start, "lt": end

                                                        }}}
                        ]
                    }
                }
            }


        results_gen = scan(
            es,
            query=query_body,
            index='bank_y' + str(year),
        )

        results = list(results_gen)
        dara = pd.DataFrame([j['_source'] for j in results])

        # print(dara)

        # dara = dara.set_index('Time')
        dara['Time'] = pd.to_datetime(dara['Time'])

        # dara['Time'] = pd.to_datetime(dara['Time'])

        # print(dara.columns)

        plo = combine_hour(dara, peroid, lis[i], True,start,end)

        plo['sum_seat'] = plo['Seats'].map(sum)

        # print(plo.shape)

        chart[lis[i]] = plo['sum_seat']
        chart[lis[i] + "_c"] = plo["Arr Time"]

        # print(dara.columns)

        # print(pd.DataFrame(dara.groupby(['Region_dest'])['Seats'].sum()).sort_values('Seats', ascending=False).to_dict()['Seats'])
        # print(pd.DataFrame(dara.groupby(lis[i-1])['Seats'].sum()/dara['Seats'].count()).sort_values('Seats', ascending=False).head(10).to_dict()['Seats'])

        table['pie_' + lis[i] + '_sum'] = pd.DataFrame(dara.groupby(['Region_' + lis[i-1].lower()])[
                                                       'Seats'].sum()).sort_values('Seats', ascending=False).to_dict()['Seats']
        table['pie_' + lis[i] + '_count'] = pd.DataFrame(dara.groupby(['Region_' + lis[i-1].lower()])[
                                                         'Seats'].count()).sort_values('Seats', ascending=False).to_dict()['Seats']
        # print(table['pie_' + lis[i] + '_count'])

        table['top_' + lis[i] + '_sum'] = pd.DataFrame(dara.groupby(lis[i-1])['Seats'].sum(
        )/dara['Seats'].sum()).sort_values('Seats', ascending=False).head(10).to_dict()['Seats']
        table['top_' + lis[i] + '_count'] = pd.DataFrame(dara.groupby(lis[i-1])['Seats'].count(
        )/dara['Seats'].count()).sort_values('Seats', ascending=False).head(10).to_dict()['Seats']

        dic, meta = freq(plo, lis[i], num)

        tmp = pd.DataFrame(dic)

        # print(tmp)
        # print(tmp.to_json(orient='split'))

        if(lis[i] == 'Dest'):
            tmp = pd.DataFrame(dic) * (-1)

        table[lis[i]] = tmp.to_json(orient='split')
        table['meta_' + lis[i]] = meta

    cumulative = chart['Dest'] - chart['Orig']
    cumulative_c = chart['Dest_c'] - chart['Orig_c']

    # print(cumulative)

    cumu = 0
    cumu_c = 0
    lis = []
    lis_c = []
    for i, j in zip(cumulative, cumulative_c):
        cumu += i
        cumu_c += j
        lis.append(cumu)
        lis_c.append(cumu_c)

    chart['cumulative'] = lis
    chart['cumulative_c'] = lis_c

    chart = chart.fillna(0)


    # print(chart)

    print(type(table['Dest']))

    # print(chart)

    response = {"bank_arr": table['Dest'],
                "bank_dep": table['Orig'],
                "meta_arr": table['meta_Dest'],
                "meta_dep": table['meta_Orig'],
                "top_arr_sum": table['top_Dest_sum'],
                "top_arr_count": table['top_Dest_count'],
                "top_dep_sum": table['top_Orig_sum'],
                "top_dep_count": table['top_Orig_count'],
                "pie_arr_sum": table['pie_Dest_sum'],
                "pie_arr_count": table['pie_Dest_count'],
                "pie_dep_sum": table['pie_Orig_sum'],
                "pie_dep_count": table['pie_Orig_count'],
                "index": [str(i) for i in list(chart.index)],
                "arr": list(chart['Dest']),
                "dep": [(-i) for i in list(chart.Orig)],
                "cumulative": list(chart['cumulative']),
                "arr_flight": list(chart['Dest_c']),
                "dep_flight": [(-i) for i in list(chart.Orig_c)],
                "cumulative_flight": list(chart['cumulative_c']),
                "table": [chart['cumulative'].mean()] * len([i for i in chart['Orig']]),
                "table_flight": [chart['cumulative_c'].mean()] * len([i for i in chart['Orig']])
                }

    # print(table['top_Dest_sum'])
    # print(response['dep_flight'])

    response = make_response(
        jsonify(response))
    # response.headers['Access-Control-Allow-Origin'] = "*"
    response.headers['Content-Type'] = 'application/json'

    return response
