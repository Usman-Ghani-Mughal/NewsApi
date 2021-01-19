
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
        COLLECTION_NAME = 'User_collection'
        COLLECTION_USERS = 'Users_profiles'
        USER_NAME = "news-shop"
        USER_PASSWORD = "news-shop"

        con = pymongo.MongoClient("mongodb+srv://news-shop:news-shop@newscluster.wyfdp.mongodb.net/NEWS_DATABASE?retryWrites=true&w=majority")
        db = con[DB_NAME]
        collection = db[COLLECTION_USERS]
        query = {"Name": sys.argv[1]}
        data = collection.find(query)
        print(data[0]['interests'])
        # print("->>", data[0])
    except Exception as e:
        print("PAKISTAN")
        # print(e)

if __name__ == '__main__':
    main()