# Imports
import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.frequent_patterns import association_rules
import pymongo

class GenrateRules:
    DB_NAME = 'NEWS_DATABASE'
    COLLECTION_NAME = 'User_collection'
    USER_NAME = "news-shop"
    USER_PASSWORD = "news-shop"
    CONNECTION_STRING = "mongodb+srv://news-shop:news-shop@newscluster.wyfdp.mongodb.net/NEWS_DATABASE?retryWrites=true&w=majority"

    def __init__(self):
        try:
            # create connection
            self.con = pymongo.MongoClient(GenrateRules.CONNECTION_STRING)
            print("Connection made succesfully")

            # select database
            self.db = self.con[GenrateRules.DB_NAME]

            # select collection
            self.collection = self.db[GenrateRules.COLLECTION_NAME]

            self.genrate_rules()
        except Exception as e:
            print(e)

    def genrate_rules(self):
        try:
            df = pd.DataFrame(data=self.collection.find({}))
            self.con.close()

            df = df[['name', 'userinterests']]
            # Set all categories for column
            categories = ['PAKISTAN', 'WORLD','BUSINESS','SPORTS','ENTERTAINMENT','HEALTH','SCI & TECH','OFFBEAT','LIFESTYLE', 'BLOGS',
                          'SPECIAL', 'ACCIDENTS', 'CRIME AND CORRUPTION', 'COURTS AND CASES','TECHNOLOGY']

            # make parse df
            parse_df = pd.DataFrame(columns=categories)

            names = df.name.to_list()
            uinterest = df.userinterests.to_list()
            
            # loop through all transactions
            for name,u_i in zip(names,uinterest):
                # Convert interests into list
                u_i_list = u_i.split(',')
                row = dict()

                for category in categories:
                    if category in u_i_list:
                        row[category] = 1
                    else:
                        row[category] = 0
                
                # make series with index name
                row = pd.Series(row, name=name)
                # insert row in  data frame
                parse_df = parse_df.append(row)


            parse_df.to_csv("RecomendationFiles/parse_matrix.csv", index=True)

            # Make approri
            freq_item = apriori(parse_df, min_support=0.001, use_colnames=True)
            # Genrate rules
            rul = association_rules(freq_item, metric='confidence', min_threshold=0.2)

            # Covert frosent set to list
            rul['antecedents'] = rul.apply(lambda row: list(row.antecedents), axis=1)
            rul['consequents'] = rul.apply(lambda row: list(row.consequents), axis=1)

            rul.to_csv('RecomendationFiles/Rules_dataFrame.csv', index=False)

            print("*** Rules are genrates Successfully ***")

        except Exception as e:
            print("*** Some error *** ", e)

def main():
    obj = GenrateRules()
    

if __name__ == '__main__':
    main()