# Imports
import pandas as pd
import pymongo
import sys

class GenrateUserProfile:
    DB_NAME = 'NEWS_DATABASE'
    COLLECTION_NAME = 'User_collection'
    COLLECTION_USERS = 'Users_profiles'
    USER_NAME = "news-shop"
    USER_PASSWORD = "news-shop"
    CONNECTION_STRING = "mongodb+srv://news-shop:news-shop@newscluster.wyfdp.mongodb.net/NEWS_DATABASE?retryWrites=true&w=majority"

    def __init__(self):
        try:
            # create connection
            self.con = pymongo.MongoClient(GenrateUserProfile.CONNECTION_STRING)
            print("Connection made successfuly from python")

            # connect database
            self.db = self.con[GenrateUserProfile.DB_NAME]

            # select collection
            self.collection = self.db[GenrateUserProfile.COLLECTION_USERS]

            self.genrate_profile()

            print("*** User profiles genrated succesfully. ***")

        except Exception as e:
            print(e)

    def genrate_profile(self):
        try:
            # Get rules
            rul_df = pd.read_csv('RecomendationFiles/Rules_dataFrame.csv', converters={'antecedents': eval, 'consequents': eval})
            # get user name and interests of new user.
            userinterests = sys.argv[1]
            username = sys.argv[2]
            # convert user interest into list.
            u_i_list = userinterests.split(',')

            applied_rul_df =  pd.DataFrame(columns=rul_df.columns)
            
            for index, row in  rul_df.iterrows():
                if(self.pick_rules(row,u_i_list)):
                    applied_rul_df = applied_rul_df.append(row)
                    
            # get a rule which have higest lift 
            if(applied_rul_df.shape[0] >= 1):

                columns_names = ['antecedents', 'consequents', 'antecedent support', 'consequent support', 'support', 'confidence', 'lift', 'leverage', 'conviction']    
                selected_rule = applied_rul_df.loc[applied_rul_df['lift'].argmax(), columns_names]
                userSeleted_Interest = selected_rule.consequents[0]

                new_user = {
                    "Name": username,
                    "interests": userSeleted_Interest
                }
                self.collection.insert_one(new_user)
            else:
                # In case no rule is matched with the user Interests.
                new_user = {
                    "Name": username,
                    "interests": "PAKISTAN"
                }
                self.collection.insert_one(new_user)

            self.con.close()

        except Exception as e:
            print(e)
            self.con.close()

    def pick_rules(self, row, user_interest_list):
        consider_antecedents = True
        consider_consequents = True

        # Loop through all antecedents and find is this antecedents are
        # related to user intersts or not?.
        for item in row.antecedents:
            if item not in user_interest_list:
                consider_antecedents = False

        if  consider_antecedents:
            # Antecedents are matched

            # Now check if consequents of this rule is not in users Interests
            # then this rule is for this user.
            for item in row.consequents:
                if item in user_interest_list:
                    consider_consequents = False
                    
            if(consider_consequents):
                # This rule is matched with the user.
                return True
            else:
                return False

        else:
            return False
        
        # if consider_antecedents and consider_consequents:
        #     return True
        # else:
        #     return False

def main():
    obj = GenrateUserProfile()

if __name__ == '__main__':
    main()