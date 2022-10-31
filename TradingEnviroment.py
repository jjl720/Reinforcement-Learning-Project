# -*- coding: utf-8 -*-
"""
Created on Tue Aug 23 02:16:02 2022

@author: Joao Ji Won Lee
"""
from yahoo_fin.stock_info import get_data
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from yahoo_fin.stock_info import get_data
import pandas as pd
import collections


class tradingEnv:
    class DoubleLinkedList:
        class Node:
            def __init__(self, next, prev, element):
                self.next = next 
                self.prev = prev 
                self.data = element
                
            
            def __repr__(self):
                return repr(self.data)
                
            def __getitem__(self, item):
                return self.data[item]
        
        def __init__(self): 
            self.head = self.Node(None, None, None)
            self.tail = self.Node(None, None, None)
            self.head.next = self.tail
            self.tail.prev = self.head
            self.size = 0
          
        def add_tail(self, element):
            new_node = self.Node(self.tail, self.tail.prev, element)
            self.tail.prev.next = new_node
            self.tail.prev = new_node
            self.size = self.size + 1
        
        def size(self):
            return self.size
        
        def __str__(self):
            result = ['head <--> ']
            curNode = self.head.next
            while (curNode.next is not None):
                result.append(str(curNode.data) + " <--> ")
                curNode = curNode.next
            result.append("tail")
            return "".join(result)           
    """
    
    """
    def __init__ (self):
        self.linked_list = self.DoubleLinkedList()
        self.current_state = self.linked_list.head
        self.action_record = []
        self.features = None
        self.interval = 1
        self.portfolio = collections.deque()
        self.rewards_list = []

    def upload_data(self, data, interval):
        if self.linked_list.size == 0:
            self.interval = interval
            interval_list = []
            for row in range(len(data)):
                interval_list.append(data.loc[row])
                if len(interval_list)== interval:
                    self.linked_list.add_tail(interval_list)
                    interval_list = []
            self.features = data.columns
            self.next_state()
            return print ('Upload Complete')
        else:
            return print('Data Already Updated')
        
    def current(self):
        return self.current_state
    
    def add_feature(self):
        pass
    
    def portfolio_manager(self,act):
        reward = 0
    
        if act in ["Buy","buy"]:
            # Add stock to portfolio with price bought
            self.portfolio.append(self.current_state[self.interval-1]['adjclose'])
            reward =self.current_state.next[self.interval-1]['adjclose'] - self.current_state[self.interval-1]['adjclose']
        
        if act in ["Sell","sell"]:
            if len(self.portfolio) > 0:
                # Sell the stock from portfolio 
                return reward
            else:
                # Portfolio Empty but tried to Sell = Shorting the stock
                self.portfolio.append(self.current_state[self.interval-1]['adjclose']*-1) 
                reward = self.current_state[self.interval-1]['adjclose'] - self.current_state.next[self.interval-1]['adjclose'] 
            
            if act in ['hold','Hold']:
                reward = 0
                
        return  reward
    
    def action(self,act):               
        if self.current_state == self.linked_list.tail:
            return print('Last State Please Reset Enviroment')
        else:
            self.action_record.append(act)
            reward = self.portfolio_manager(act)
            self.rewards_list.append(reward)
            return self.next_state(), ' Reward Value From action'+ act + ":" + str(reward)
    
    def next_state(self):
        self.current_state = self.current_state.next
        return self.current_state
    
    def graph(self,y_axis):
        
        """
        Plots the graph with the given y_axis feature
        Addtional Scatter marks will represent different actions
        """
        
        fig, ax = plt.subplots()
       
        start = self.linked_list.head.next
        dates = []
        features =[]
        for i in range(self.linked_list.size):
         
            for j in range(self.interval):
                dates.append(start[j]['date'])
                features.append(start[j][y_axis])
            if len(self.action_record) > i:
             
                if self.action_record[i] in ["Buy","buy"]:
                    ax.scatter(start[self.interval-1]['date'],start[self.interval-1][y_axis], marker = "^", c='blue')
                   
                if self.action_record[i] in ["Sell","sell"]:
                    ax.scatter(start[self.interval-1]['date'],start[self.interval-1][y_axis], marker = "v", c='red')
                    
                if self.action_record[i] in ["Hold","hold"]:
                    ax.scatter(start[self.interval-1]['date'],start[self.interval-1][y_axis], marker = "o", c='green')
                
                #ax.text(start[self.interval-1]['date'],start[self.interval-1][y_axis],start[self.interval-1]['date'].date())
          
            start = start.next
            
        ax.plot(dates, features, c = 'black')
        ax.set_xlabel('Time')
        ax.set_ylabel(y_axis)
        fig.suptitle(y_axis + ' vs. '+ 'Time', fontsize=15)
        fig.autofmt_xdate()
        plt.show()
        
    def initial(self):
        return self.linked_list.head.next

    def final(self):
        return self.tail.prev
    
    def reset(self):
        self.current_state = self.initial()
        self.action_record = []
        return self.current_state
    
    def __repr__(self):
        return str(self.linked_list)


def data_extracting(index, start, end, interval):
    """
    Start_date = 'MM/DD/YYYY'
    End_date =  'MM/DD/YYYY'
    Interval = "1wk" || "1mo" || "1d"
    data_extracting( ticker,Start_date,End_date,"1wk")
    """
    data = get_data(index, start_date=start, end_date=end, index_as_date = False, interval=interval)
    data.fillna(0, inplace=True)
    data=data.set_axis(['date', 'open', 'high','low','close','adjclose','volume','ticker'], axis=1)
        
    return data  
   
apple_data = data_extracting('AAPL','01/01/2022','01/20/2022',"1d")



env = tradingEnv()  # Initiallize the Enviroment
env.upload_data(apple_data,1) # Upload Stock Data to Enviroment upload_data(data,interval)
env.current_state

env.current_state[0].to_numpy()[1:7]
env.current_state
env.linked_list.size

env.graph('adjclose')


    
    
    
    
