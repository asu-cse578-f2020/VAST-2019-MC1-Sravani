
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import time
import datetime
import functools
nba=pd.read_csv("Data//mc1-reports-data.csv")




def get_damage_mean_by_category(category):
    nba["time"]= pd.to_datetime(nba["time"])
    print(nba["time"].max(),nba["time"].min())
    print(nba["time"].max()-nba["time"].min())
    nba['hour'] = nba.time.dt.hour
    nba['date']=nba.time.dt.date
    nba_location=nba.groupby(nba.location,as_index=False)
    locations=0*[19]
    locations_timelyAverage=0*[19]
    locations_timeAnalysis=0*[19]
    for group_name,location in nba_location:
        locations_daysData=0*[5]
        temp=nba_location.get_group(group_name).dropna(subset=[category])
        #temp.to_excel(category+'_'+str(group_name)+'_withoutblanks.xlsx')
        temp=temp.set_index('time')
        temp['time']=temp.index
        locations_daysData.append(temp.loc['2020-04-06'])
        locations_daysData.append(temp.loc['2020-04-07'])
        locations_daysData.append(temp.loc['2020-04-08'])
        locations_daysData.append(temp.loc['2020-04-09'])
        locations_daysData.append(temp.loc['2020-04-10'])
        locations.append(locations_daysData)
        locations_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)[category].mean())
        locations_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)[category].mean())
    maxList = max(locations_timelyAverage, key = lambda i: len(i))
    maxLength = len(maxList)
    df = functools.reduce(lambda left,right: pd.merge(left,right,on='time',how='outer'),locations_timeAnalysis)
    # df.to_excel(category+'.xlsx')
    damage = pd.DataFrame(df)
    i=0
    locations = ['Time', 'Palace Hills', 'Northwest', 'Old Town', 'Safe Town', 'Southwest', 'Downtown', 'Wilson Forest', 'Scenic Vista', 'Broadview', 'Chapparal', 'Terrapin Springs', 'Pepper Mill', 'Cheddarford', 'Easton', 'Weston', 'Southton', 'Oak Willow', 'East Parton', 'West Parton']
    damage.columns = locations
    for col in damage.columns: 
        i = i+1
        print(col, i)
    return damage
    

# get_damage_mean_by_category("medical")