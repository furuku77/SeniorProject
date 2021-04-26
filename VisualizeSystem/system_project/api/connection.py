import networkx as nx
import pandas as pd
from nested_dict import nested_dict
import calendar
import operator


def sum_passenger(sin_direct):
    sin_direct['passenger'] = sin_direct.groupby(['Orig', 'Stop1','Stop2','Stop3','Dest'], dropna=False)['passenger'].transform('sum')
    tmp = sin_direct.groupby(['Orig', 'Stop1','Stop2','Stop3','Dest'], dropna=False)['passenger'].transform('count')
    sin_direct.insert(6, column='count', value=tmp)
    # print(sin_direct)
    sin_direct = sin_direct.drop_duplicates()
    sin_direct = sin_direct.sort_values('passenger', ascending=False)

    


    # print(sin_direct.dtypes)
    
    return sin_direct

def select_stop(y2017_foreign):
    non_stop = y2017_foreign[y2017_foreign['Stop1'].isnull() & y2017_foreign['Stop2'].isnull() & y2017_foreign['Stop3'].isnull() & y2017_foreign['passenger'].notnull()].sort_values('passenger', ascending=False) 
    non_stop.drop(['Stop1','Stop2','Stop3'],axis=1, inplace=True)
    
    stop1 = y2017_foreign[y2017_foreign['Stop1'].notnull() & y2017_foreign['Stop2'].isnull() & y2017_foreign['Stop3'].isnull() & y2017_foreign['passenger'].notnull()].sort_values('passenger', ascending=False) 
    stop1.drop(['Stop2','Stop3'],axis=1, inplace=True)

    stop2 = y2017_foreign[y2017_foreign['Stop1'].notnull() & y2017_foreign['Stop2'].notnull() & y2017_foreign['Stop3'].isnull() & y2017_foreign['passenger'].notnull()].sort_values('passenger', ascending=False) 
    stop2.drop(['Stop3'],axis=1, inplace=True)
    
    stop3 = y2017_foreign[y2017_foreign['Stop1'].notnull() & y2017_foreign['Stop2'].notnull() & y2017_foreign['Stop3'].notnull() & y2017_foreign['passenger'].notnull()].sort_values('passenger', ascending=False) 

    return [non_stop, stop1, stop2, stop3]


def make_link(each_route):
    edge_stop = pd.DataFrame(columns=['node1', 'node2', 'passenger','count'])
    overall = pd.DataFrame(columns=['node1', 'node2', 'passenger','count'])
    name = ['non_stop','Stop1','Stop2','Stop3']
    group = {}
    for tran in range(len(name)):
        # print()
        # print(each_route[tran].columns)
        # each_route[tran] = each_route[tran].iloc[:,1:each_route[tran].shape[1]]
        # each_route[tran] = each_route[tran].iloc[:,0:2+tran]
        
        edge_stop = pd.DataFrame(columns=['node1', 'node2', 'passenger','count'])
        for i in range (0,tran+1):
            # print(each_route[tran].iloc[:, i:i+2])
            add_data = each_route[tran].iloc[:, i:i+2]
            add_data['passenger'] = each_route[tran]['passenger']
            add_data['count'] = each_route[tran]['count']
            # print(add_data.dtypes)
            lis_node = list(add_data.columns)
            # print(lis_node)
            add_data = add_data.rename(columns={lis_node[0]: "node1", lis_node[1]: "node2"})
            # print(add_data)
            edge_stop = edge_stop.append(add_data)
            overall = overall.append(add_data)

        if edge_stop.shape[0] != 0:


            group[name[tran]] = edge_stop.groupby(["node1", "node2"])[['passenger','count']].apply(lambda x : x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
        else:
            group[name[tran]] = pd.DataFrame(columns=['node1', 'node2', 'passenger','count'])
        # print(group[name[tran]])
    # print(overall.dtypes)
    # overall = overall.groupby(["node1", "node2"])[['passenger']].sum().reset_index()
    # for index,row in overall.iterrows():
    #     print(row['node1'],row['node2'],row['passenger'],row['count'])

    if overall.shape[0] != 0:
        overall = overall.groupby(["node1", "node2"])[['passenger','count']].apply(lambda x : x.astype(int).sum()).reset_index().sort_values('passenger', ascending=False)
    else:
        overall = pd.DataFrame(columns=['node1', 'node2', 'passenger','count'])

    # print(group['Stop2'])
    return group,overall

def get_degree(overall):
    # ans = overall.groupby(["node1", "node2"]).sum().reset_index().sort_values('passenger', ascending=False)
    
    G=nx.from_pandas_edgelist(overall, 'node1', 'node2' ,create_using=nx.DiGraph())

    node_in = overall.groupby(["node1"])[['passenger']].apply(lambda x : x.astype(int).sum())
    node_out = overall.groupby(["node2"])[['passenger']].apply(lambda x : x.astype(int).sum())
    
    node_in = pd.Series(node_in['passenger'].values,index=node_in.index).to_dict()
    node_out = pd.Series(node_out['passenger'].values,index=node_out.index).to_dict()
    degree_in = dict(G.in_degree())
    degree_out = dict(G.out_degree()) 


    

    # print(G.in_degree())
    LisMax = []
    ds = [degree_in,degree_out,node_in,node_out]

    for i in ds:
        LisMax.append(max(i.items(), key=operator.itemgetter(1))[1])
    
    print(LisMax)

    # print(node_in)
    # print()
    # print(degree_in)
    # for_node = nested_dict(2, int)
    # for k in degree_in.keys():
    #     for_node[k] = list(tuple(for_node[k] for for_node in ds))

    # tmp = pd.DataFrame.from_dict(for_node, orient='index',columns=['degree_in','degree_out'])
    tmp = pd.DataFrame(ds).T.fillna(0)
    tmp = tmp.rename(columns={0: "degree_in", 1: "degree_out", 2: "node_in", 3: "node_out"})
    tmp = tmp.reset_index().rename(columns={'index': 'name'})
    tmp['val'] = tmp[['degree_in','degree_out','node_in','node_out']].apply(list, axis=1)
    for_node  = (tmp[['name','val']].to_dict('records')) 

    # print(for_node)

    return for_node ,LisMax
    # return dict(G.in_degree()), dict(G.out_degree()) , nx.betweenness_centrality(G) 


def sum_path(sin_direct):
    sin_direct = sin_direct[['Orig','Dest','passenger']]
    sin_direct['passenger'] = sin_direct.groupby(['Orig','Dest'], dropna=False)['passenger'].transform('sum')
    sin_direct['count'] = sin_direct.groupby(['Orig','Dest'], dropna=False)['passenger'].transform('count')
    sin_direct = sin_direct.drop_duplicates()
    
    return sin_direct.sort_values('passenger', ascending=False).head(20)

def sum_path_month(sin_direct):
    sin_direct = sin_direct[['Travel Month','passenger']]
    print(sin_direct.shape)
    sin_direct['Travel Month'] = pd.to_datetime(sin_direct['Travel Month'])
    sin_direct = sin_direct.resample('M', on='Travel Month').sum()
    # sin_direct.index = sin_direct.index.dt.strftime('%b')
    sin_direct.index = sin_direct.index.month_name()
    
    # print(list(sin_direct['Travel Month']))
    # sin_direct['passenger'] = sin_direct.groupby(['Orig','Dest'], dropna=False)['passenger'].transform('sum')
    # sin_direct['count'] = sin_direct.groupby(['Orig','Dest'], dropna=False)['passenger'].transform('count')
    # sin_direct = sin_direct.drop_duplicates()
    month = list(sin_direct.index)
    passen = list(sin_direct['passenger'])

    min_month = month[passen.index(min(passen))]
    max_month = month[passen.index(max(passen))]
    
    return  month, passen,min_month,max_month

def get_year(year):
    index = ""
    if year == 0:
        index = '2005'
    elif year == 1:
        index = '2006'
    elif year == 2:
        index = '2007'
    elif year == 3:
        index = '2008'
    elif year == 4:
        index = '2009'
    elif year == 5:
        index = '2010'
    elif year == 6:
        index = '2011'
    elif year == 7:
        index = '2012'
    elif year == 8:
        index = '2013'    
    elif year == 9:
        index = '2014'
    elif year == 10:
        index = '2015'
    elif year == 11:
        index = '2016'
    elif year == 12:
        index = '2017'
    elif year == 13:
        index = '2018'
    elif year == 14:
        index = '2019'

    return index