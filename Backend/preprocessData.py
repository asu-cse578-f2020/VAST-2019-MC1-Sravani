
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import time
import datetime
import functools
import collections
import math
from scipy.stats import entropy

nba=pd.read_csv("Data//mc1-reports-data.csv",parse_dates=['time'])

nba=nba.set_index('time')
nba['time']=nba.index

def get_damage_mean_by_category(category):
    nba["time"]= pd.to_datetime(nba["time"])
    nba['hour'] = nba.time.dt.hour
    nba['date']=nba.time.dt.date
    nba_location=nba.groupby(nba.location,as_index=False)
    locations=0*[19]
    locations_timelyAverage=0*[19]
    locations_timeAnalysis=0*[19]
    for group_name,location in nba_location:
        locations_daysData=0*[5]
        temp=nba_location.get_group(group_name).dropna(subset=[category])
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
    damage = pd.DataFrame(df)
    locations = ["time", "palace_hills", "northwest", "old_town", "safe_town", "southwest", "downtown", "wilson_forest", "scenic_vista", "broadview", "chapparal", "terrapin_springs", "pepper_mill", "cheddarford", "easton", "weston", "southton", "oak_willow", "east_parton", "west_parton"]
    damage.columns = locations
    return damage

def get_mean_by_category(category,t1,t2):
    mask = (nba['time'] >= t1) & (nba['time'] <= t2)
    temp = nba.loc[mask]
    nba_location=temp.groupby(temp.location,as_index=False)
    locations=0*[19]
    locations_timelyAverage=0*[19]    
    for group_name,location in nba_location:
        temp_category=nba_location.get_group(group_name).dropna(subset=[category])
        locations_timelyAverage.append([group_name,temp_category[category].mean()])
    df=pd.DataFrame(locations_timelyAverage)
    return df

def get_entropy_by_category(category,t1,t2):
    mask = (nba['time'] >= t1) & (nba['time'] <= t2)
    temp = nba.loc[mask]
    nba_location=temp.groupby(temp.location,as_index=False) 
    locations=0*[19]
    locations_timelyAverage=0*[19]
    for group_name,location in nba_location:
        temp_category=nba_location.get_group(group_name).dropna(subset=[category])
        bases = collections.Counter([tmp_base for tmp_base in temp_category[category]])
        dist = [x/sum(bases.values()) for x in bases.values()]
        entropy_value = entropy(dist, base=11)
        locations_timelyAverage.append([group_name,entropy_value]) 
    
    df=pd.DataFrame(locations_timelyAverage)
    return df