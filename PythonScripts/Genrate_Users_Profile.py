# Imports
import pandas as pd
import pymongo

class GenrateUserProfile:
    DB_NAME = 'NEWS_DATABASE'
    COLLECTION_NAME = 'User_collection'
    USER_NAME = "news-shop"
    USER_PASSWORD = "news-shop"

    def __init__(self):
        try:
            # create connection
            self.con = pymongo.MongoClient(
                "mongodb+srv://news-shop:news-shop@newscluster.wyfdp.mongodb.net/NEWS_DATABASE?retryWrites=true&w=majority")

            # connect database
            self.db = self.con[GenrateUserProfile.DB_NAME]

            # select collection
            self.collection = self.db[GenrateUserProfile.COLLECTION_NAME]

            self.genrate_profile()
            print("User Profiles are genrated succesfully.")
        except Exception as e:
            print(e)

    def genrate_profile(self):
        try:
            rul_df = pd.read_csv('RecomendationFiles/Rules_dataFrame.csv', converters={'antecedents': eval, 'consequents': eval})
            users = pd.DataFrame(data=self.collection.find({}))
            

            self.con.close()
            users = users[['name', 'userinterests']]
            names = users.name.to_list()
            uinterest = users.userinterests.to_list()

            users_Recomendations_df = pd.DataFrame(columns=rul_df.columns)

            # For each user.
            for name,u_i in zip(names,uinterest):
                u_i_list = u_i.split(',')
                
                applied_rul_df =  pd.DataFrame(columns=rul_df.columns)
                
                # Check each Rule.
                for index, row in  rul_df.iterrows():
                    if(self.pick_rules(row,u_i_list)):
                        applied_rul_df = applied_rul_df.append(row)
                    
                # get a rule which have higest lift 
                if(applied_rul_df.shape[0] >= 1):

                    columns_names = ['antecedents', 'consequents', 'antecedent support', 'consequent support', 'support', 'confidence', 'lift', 'leverage', 'conviction']    
                    selected_rule = applied_rul_df.loc[applied_rul_df['lift'].argmax(), columns_names]
                    selected_rule.name = name
                    # user = pd.Series(selected_rule.to_dict(), name=u_id)
                    users_Recomendations_df = users_Recomendations_df.append(selected_rule)

                

            # NOW Store user info to file
            users_Recomendations_df.to_csv('RecomendationFiles/user_recomendation.csv', index=True)

        except Exception as e:
            print(e)

    def pick_rules(self, row, user_interest_list):
        consider_antecedents = True
        consider_consequents = True

        for item in row.consequents:
            if item in user_interest_list:
                consider_consequents = False
                
        if(not consider_consequents):
            return False
        
        # Kiya antecedents user interest k andr ha?
        for item in row.antecedents:
            if item not in user_interest_list:
                consider_antecedents = False
        
        if consider_antecedents and consider_consequents:
            return True
        else:
            return False

def main():
    obj = GenrateUserProfile()

    

if __name__ == '__main__':
    main()