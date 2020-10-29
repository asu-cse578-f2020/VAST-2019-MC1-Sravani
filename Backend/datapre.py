# -*- coding: utf-8 -*-
"""Created on Thu Sep 24 01:11:15 2020
danger zones:mean,uncertainity:entropy
@author: krajula
"""
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import time
import datetime 
import functools
nba=pd.read_csv("Data//mc1-reports-data.csv")

print(len(nba))
print(nba.shape)
#pd.set_option("display.max.columns", None)
#print(nba.tail())  
#print(nba.info()) 
#print(nba.describe())
#print(nba.describe(include=np.object))
#print(nba["location"].value_counts())
#print(nba["time"])
#print(nba.info())
#air_quality["datetime"].min(), air_quality["datetime"].max()
nba["time"]= pd.to_datetime(nba["time"]) 
print(nba["time"].max(),nba["time"].min())
print(nba["time"].max()-nba["time"].min())
nba['hour'] = nba.time.dt.hour
nba['date']=nba.time.dt.date
#print(nba["time"],nba["hour"],nba["date"])
#print(nba.head())
#nba=nba.set_index('time')
#print(nba.loc['2020-04-06'])
#print(nba.time.dt.date)
#print(nba['time'].dt.hour)
#nba=nba.set_index('time')
#print(nba.index)
#print(nba.loc['2020-04-08'])
#nba.loc['2020-04-08','shake_intensity'].plot(linewidth=0.5)
#print(nba.info()) 
#print(nba.groupby( [ "location",nba["time"],as_index=False])["shake_intensity"].mean())

nba_location=nba.groupby(nba.location,as_index=False)
#print(nba_location.describe())
#fig, axs = plt.subplots(figsize=(12, 4))
#print(nba_location.size())
locations=0*[19]

locations_timelyAverage=0*[19]
#Medical_timelyAverage=0*[19]
#Power_timelyAverage=0*[19]
#Buildings_timelyAverage=0*[19]
#SandW_timelyAverage=0*[19]
#RandB_timelyAverage=0*[19]

locations_timeAnalysis=0*[19]
#Medical_timeAnalysis=0*[19]
#Power_timeAnalysis=0*[19]
#Buildings_timeAnalysis=0*[19]
#SandW_timeAnalysis=0*[19]
#RandB_timeAnalysis=0*[19]
category=input("select a category: shake_intensity , medical , power ,buildings , sewer_and_water , roads_and_bridges :")
print(category)
for group_name,location in nba_location:
    locations_daysData=0*[5]
    
    
    #temp_x=nba_location.get_group(group_name)
    #temp_x.to_excel(str(group_name)+'.xlsx')
    temp=nba_location.get_group(group_name).dropna(subset=[category])
    #temp1=nba_location.get_group(group_name)
    #temp=temp[temp['date']=='2020-04-09']
    temp=temp.set_index('time')
    temp['time']=temp.index
    # print(temp.count())
    locations_daysData.append(temp.loc['2020-04-06'])
    locations_daysData.append(temp.loc['2020-04-07'])
    locations_daysData.append(temp.loc['2020-04-08'])
    locations_daysData.append(temp.loc['2020-04-09'])
    locations_daysData.append(temp.loc['2020-04-10'])
    locations.append(locations_daysData)
    
    #print(temp.head())
    #print(locations_daysData[0].head())
    # print(locations_daysData[1].info())
    # print(locations_daysData[2].info())
    # print(locations_daysData[3].info())
    # print(locations_daysData[4].info())
    #print(temp1.count())
    #print(group_name)
    #print(locations[group_name-1]) 
    #locations[group_name-1].groupby(locations[group_name-1].hour,as_index=False)['shake_intensity'].mean().plot.bar(x='hour',rot=0)
    
    #print(temp.info())
    #print(group_name)
    #print(locations[group_name-1][0].head())
    locations_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)[category].mean())
    #Medical_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)['medical'].mean())
    #Power_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)['power'].mean())
    #Buildings_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)['buildings'].mean())
    #SandW_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)['sewer_and_water'].mean())
    #RandB_timelyAverage.append(locations[group_name-1][2].groupby(locations[group_name-1][2].hour,as_index=False)['roads_and_bridges'].mean())
    #print(len(locations_daysData))
    #for i in range(len(locations_daysData)):
    locations_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)[category].mean())
    #Medical_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)['medical'].mean())
    #Power_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)['power'].mean())
    #Buildings_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)['buildings'].mean())
    #SandW_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)['sewer_and_water'].mean())
    #RandB_timeAnalysis.append(locations[group_name-1][2].groupby(locations[group_name-1][2].time,as_index=False)['roads_and_bridges'].mean())
    
    #print(locations_timeAnalysis[group_name-1].head())
    

maxList = max(locations_timelyAverage, key = lambda i: len(i)) 
maxLength = len(maxList)
print(maxLength)
#print(locations_timeAnalysis[0]) 
#print(locations_timeAnalysis[4])
print(len(locations_timelyAverage))
#inner_merged_total = pd.merge(locations_timeAnalysis[0],locations_timeAnalysis[1],how="outer" ,on=["time"])
df = functools.reduce(lambda left,right: pd.merge(left,right,on='time',how='outer'),locations_timeAnalysis)
print(df['time'])
maxValuesObj = df.max(axis=1)
print('Maximum value in each row : ')
print(maxValuesObj)

#df.to_excel(category+'.xlsx')
#for location in locations_timeAnalysis:
    #print(location)
    
#locations_timelyAverage.plot.bar(x='hour',rot=0)
# set width of bar
#barWidth = 0.25
#Power_timelyAverage[0].plot.bar(x='hour',rot=0)
# set height of bar
#Power_timelyAverage[0].plot.density()
#plt.hist([Power_timelyAverage[0],Buildings_timelyAverage[0]])
locations_timelyAverage[0].plot.bar(x='hour',rot=0,color = 'black')


 
# # Set position of bar on X axis
#r1 = np.arange(maxLength)
#plt.bar(r1, locations_timelyAverage[0], color='#7f6d5f', width=barWidth, edgecolor='white', label='var1')
    
    
    
#location1=nba_location.get_group(1)
#location1_timelyAverage=location1.groupby(location1.time,as_index=False)['shake_intensity'].mean()

#print(location1_timelyAverage.info())
#print(nba.first())
'''2020-04-08
irrespective of the locations and the day just hour vs mean of shake_intensity
fig, axs = plt.subplots(figsize=(12, 4))
nba.groupby(nba["time"].dt.hour)["shake_intensity"].mean().plot(kind='bar',rot=0,ax=axs)
plt.xlabel("hour")
plt.ylabel("mean of all locations")

'''
