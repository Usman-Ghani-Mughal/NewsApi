import pandas as pd
import pymongo
import sys


def main():
    # print(platform.python_version())
    # # with open('usersRecommendationFile.txt', 'r') as reader:
    # #     print(reader.readline())
    # print("ok")

    try:
        DB_NAME = 'NEWS_DATABASE'
        COLLECTION_NAME = 'Users_profiles'
        USER_NAME = "news-shop"
        USER_PASSWORD = "news-shop"
        CONNECTION_STRING = "mongodb+srv://news-shop:news-shop@newscluster.wyfdp.mongodb.net/NEWS_DATABASE?retryWrites=true&w=majority"

        con = pymongo.MongoClient()
        db = con[DB_NAME]
        collection = db[COLLECTION_NAME]
        query = {"Name": sys.argv[1]}
        data = collection.find(query)

        # sending user interest to node.
        print(data[0]['interests'])
        # print("->>", data[0])
    except Exception as e:
        # If no matched found or got some error then we will recommend news
        #  related to Pakistan
        print("PAKISTAN")

if __name__ == '__main__':
    main()

# ------------------------------- Old Technique -----------------------------------

# # Imports

# import pandas as pd
# import pymongo
# import sys



# def main():
#     try:
#         users_df = pd.read_csv('RecomendationFiles/user_recomendation.csv', converters={'antecedents': eval, 'consequents': eval}, index_col=0)
#         username = sys.argv[1]
#         user_label = users_df.loc[ username , 'consequents']
#         print(user_label[0])
#     except Exception as e:
#         print("PAKISTAN")
    

# if __name__ == '__main__':
#     main()